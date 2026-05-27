"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, AlertCircle, Wifi } from "lucide-react";
import type { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng";
import { loadAgoraClient } from "@/services/agora.service";
import { startCall, endCall, type CallSession } from "@/services/call.service";
import { formatCurrency } from "@/services/api";

type CallState = "idle" | "ringing" | "connecting" | "connected" | "reconnecting" | "ended" | "failed";

function VideoCallContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [state, setState] = useState<CallState>("idle");
  const [session, setSession] = useState<CallSession | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timerText, setTimerText] = useState("00:00");
  const [networkQuality, setNetworkQuality] = useState<string>("Good");

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  
  const localPlayerRef = useRef<HTMLDivElement | null>(null);
  const remotePlayerRef = useRef<HTMLDivElement | null>(null);
  const ringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const reconnectAttempts = useRef(0);
  const maxReconnects = 5;

  useEffect(() => {
    if (!bookingId) {
      setErrorMsg("Invalid Booking ID");
      setState("failed");
      return;
    }

    let isMounted = true;
    setState("ringing");
    setErrorMsg("");

    // Ring timeout: Auto-cancel if not answered in 30 seconds
    ringTimerRef.current = setTimeout(() => {
      if (state !== "connected") {
        setState("failed");
        setErrorMsg("Call not answered. Missed call.");
        handleEndCall("no_answer");
      }
    }, 30000);

    const initCall = async () => {
      try {
        // Query start-call details from backend
        const response = await startCall({ booking_id: bookingId, call_type: "video_call" }, "user");
        if (!isMounted) return;

        const agoraInfo = response.data.agora;
        const callInfo = response.data.call;
        setSession(callInfo);

        // Request Mic & Camera Permissions
        let localAudio;
        let localVideo;
        try {
          const AgoraRTC = await loadAgoraClient();
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          localAudio = audioTrack;
          localVideo = videoTrack;
          localAudioTrackRef.current = localAudio;
          localVideoTrackRef.current = localVideo;
        } catch {
          if (isMounted) {
            setErrorMsg("Microphone or camera access denied. Please grant browser permissions.");
            setState("failed");
          }
          return;
        }

        // Render local track in the small thumbnail pane
        if (localPlayerRef.current) {
          localVideo.play(localPlayerRef.current);
        }

        // Initialize Agora Client
        const AgoraRTC = await loadAgoraClient();
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        // Subscribing to remote participant stream
        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          
          if (mediaType === "video" && remoteUser.videoTrack && remotePlayerRef.current) {
            remotePlayerRef.current.innerHTML = "";
            remoteUser.videoTrack.play(remotePlayerRef.current);
            if (isMounted) {
              setState("connected");
              if (ringTimerRef.current) {
                clearTimeout(ringTimerRef.current);
                ringTimerRef.current = null;
              }
            }
          }
          
          if (mediaType === "audio" && remoteUser.audioTrack) {
            remoteUser.audioTrack.play();
          }
        });

        client.on("user-unpublished", (remoteUser, mediaType) => {
          if (mediaType === "video" && remotePlayerRef.current) {
            remotePlayerRef.current.innerHTML = "";
          }
        });

        // Network Quality Tracking
        client.on("network-quality", (quality) => {
          if (quality.uplinkNetworkQuality >= 4 || quality.downlinkNetworkQuality >= 4) {
            setNetworkQuality("Weak");
          } else {
            setNetworkQuality("Good");
          }
        });

        // Reconnection limits
        client.on("connection-state-change", (curState) => {
          if (curState === "DISCONNECTING" || curState === "DISCONNECTED") {
            if (reconnectAttempts.current < maxReconnects) {
              reconnectAttempts.current += 1;
              setState("reconnecting");
            } else {
              setState("failed");
              setErrorMsg("Persistent network disconnect. Call terminated.");
              handleEndCall("network_failure");
            }
          }
        });

        // Join Agora RTC Channel
        await client.join(agoraInfo.app_id, agoraInfo.channel_name, agoraInfo.token, agoraInfo.uid);
        await client.publish([localAudio, localVideo]);

        if (isMounted) {
          setState("connecting");
        }

      } catch (err) {
        if (isMounted) {
          setErrorMsg(err instanceof Error ? err.message : "Unable to initiate video call");
          setState("failed");
        }
      }
    };

    void initCall();

    return () => {
      isMounted = false;
      if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
      cleanupTracks();
    };
  }, [bookingId]);

  // Sync Call Timer
  useEffect(() => {
    if (state !== "connected" || !session?.started_at) return;

    const interval = setInterval(() => {
      const start = new Date(session.started_at!).getTime();
      const diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
      const mins = String(Math.floor(diff / 60)).padStart(2, "0");
      const secs = String(diff % 60).padStart(2, "0");
      setTimerText(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [state, session]);

  const cleanupTracks = () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current.close();
      localAudioTrackRef.current = null;
    }
    if (localVideoTrackRef.current) {
      localVideoTrackRef.current.stop();
      localVideoTrackRef.current.close();
      localVideoTrackRef.current = null;
    }
    if (clientRef.current) {
      void clientRef.current.leave();
      clientRef.current = null;
    }
  };

  const toggleAudioMute = () => {
    if (localAudioTrackRef.current) {
      if (isAudioMuted) {
        void localAudioTrackRef.current.setEnabled(true);
        setIsAudioMuted(false);
      } else {
        void localAudioTrackRef.current.setEnabled(false);
        setIsAudioMuted(true);
      }
    }
  };

  const toggleVideoMute = () => {
    if (localVideoTrackRef.current) {
      if (isVideoMuted) {
        void localVideoTrackRef.current.setEnabled(true);
        setIsVideoMuted(false);
      } else {
        void localVideoTrackRef.current.setEnabled(false);
        setIsVideoMuted(true);
      }
    }
  };

  const handleEndCall = (reason = "user_ended") => {
    setState("ended");
    cleanupTracks();
    if (session?.id) {
      endCall(session.id, reason, "user")
        .then(() => router.push("/User/Messages"))
        .catch(() => router.push("/User/Messages"));
    } else {
      router.push("/User/Messages");
    }
  };

  return (
    <main className="min-h-screen bg-[#110118] text-white flex flex-col justify-between relative overflow-hidden font-[DM_Sans]">
      
      {/* Top Header & Overlay */}
      <div className="absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-wide">
            {session?.metadata?.astrologer_name || "Connecting..."}
          </h1>
          <p className="text-[11px] text-white/60 tracking-wider flex items-center gap-1.5 mt-0.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${state === "connected" ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"}`} />
            {state === "connected" ? `LIVE • ${timerText}` : `Connecting (${state})`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {state === "connected" && (
            <span className="text-[11px] font-semibold bg-white/10 rounded-full px-2.5 py-1 backdrop-blur flex items-center gap-1 text-green-400">
              <Wifi size={12} /> {networkQuality}
            </span>
          )}
          <span className="text-[11px] font-semibold bg-white/10 rounded-full px-2.5 py-1 backdrop-blur text-white/80">
            ₹25/Min
          </span>
        </div>
      </div>

      {/* Main Remote Player (Full Screen Video) */}
      <div className="absolute inset-0 z-10 bg-black flex items-center justify-center">
        <div ref={remotePlayerRef} className="w-full h-full object-cover" />
        
        {/* Placeholder state overlay if video not playing yet */}
        {state !== "connected" && (
          <div className="absolute inset-0 bg-[#250337] flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-[#5a0c8f]/20 rounded-full blur-xl scale-125 animate-pulse" />
              <Image
                src="/images/VideoCallimage.jpg"
                alt="Astrologer Cover"
                width={150}
                height={150}
                className="h-[120px] w-[120px] rounded-full object-cover border-2 border-white/20 relative z-10 shadow-2xl"
              />
            </div>
            
            <h2 className="text-xl font-bold tracking-wide">
              {session?.metadata?.astrologer_name || "Astrologer Call"}
            </h2>
            <p className="text-sm text-white/60 mt-1 max-w-xs leading-relaxed">
              {state === "ringing" ? "Ringing participant..." :
               state === "connecting" ? "Establishing peer token handshake..." :
               state === "reconnecting" ? "Restoring streaming connection..." : "Joining secure call room..."}
            </p>

            {errorMsg && (
              <div className="mt-5 mx-auto max-w-xs rounded-xl bg-red-500/20 border border-red-500/30 p-3 text-xs text-red-200 flex items-center gap-2 text-left">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Small Local Camera Preview Thumbnail (Picture-in-Picture) */}
      <div className="absolute bottom-28 right-4 z-20 w-[90px] h-[135px] sm:w-[110px] sm:h-[160px] rounded-xl overflow-hidden border border-white/20 bg-black/60 shadow-2xl">
        <div ref={localPlayerRef} className="w-full h-full object-cover" />
        {isVideoMuted && (
          <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center text-[10px] text-white/60">
            Camera Off
          </div>
        )}
      </div>

      {/* Bottom Calling Action Bar controls */}
      <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 to-transparent p-6 text-center flex flex-col items-center">
        <div className="flex items-center gap-5 sm:gap-6 justify-center">
          
          {/* Mute Mic */}
          <button
            onClick={toggleAudioMute}
            disabled={state === "failed" || state === "ended"}
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
              isAudioMuted ? "bg-red-500 border-red-500 text-white" : "border-white/30 bg-black/40 hover:bg-black/60 text-white"
            } disabled:opacity-50`}
          >
            {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* End Call button */}
          <button
            onClick={() => handleEndCall("user_ended")}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl hover:bg-red-700 transition-all duration-300 transform active:scale-95"
          >
            <PhoneOff size={22} />
          </button>

          {/* Toggle Video Camera */}
          <button
            onClick={toggleVideoMute}
            disabled={state === "failed" || state === "ended"}
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
              isVideoMuted ? "bg-red-500 border-red-500 text-white" : "border-white/30 bg-black/40 hover:bg-black/60 text-white"
            } disabled:opacity-50`}
          >
            {isVideoMuted ? <VideoOff size={20} /> : <VideoIcon size={20} />}
          </button>
        </div>

        <p className="mt-4 text-[10px] text-white/40 tracking-wide">
          Safe consultation room • Standard telecom rates do not apply
        </p>
      </div>
    </main>
  );
}

export default function VideoCall() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#110118] flex items-center justify-center text-white font-medium">Initializing call video...</div>}>
      <VideoCallContent />
    </Suspense>
  );
}
