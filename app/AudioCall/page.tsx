"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Mic, MicOff, PhoneOff, AlertCircle, Wifi } from "lucide-react";
import type { IAgoraRTCClient, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { loadAgoraClient } from "@/services/agora.service";
import { startCall, endCall, type CallSession } from "@/services/call.service";
import { formatCurrency } from "@/services/api";

type CallState = "idle" | "ringing" | "connecting" | "connected" | "reconnecting" | "ended" | "failed";

function AudioCallContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [state, setState] = useState<CallState>("idle");
  const [session, setSession] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [timerText, setTimerText] = useState("00:00");
  const [networkQuality, setNetworkQuality] = useState<string>("Good");

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
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

    // 1. Initial State: Ringing / Setting up
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
        // Request call details from backend
        const response = await startCall({ booking_id: bookingId, call_type: "audio_call" }, "user");
        if (!isMounted) return;

        const agoraInfo = response.data.agora;
        const callInfo = response.data.call;
        setSession(callInfo);

        // Request Microphone Permission
        let localAudio;
        try {
          const AgoraRTC = await loadAgoraClient();
          localAudio = await AgoraRTC.createMicrophoneAudioTrack();
          localAudioTrackRef.current = localAudio;
        } catch {
          if (isMounted) {
            setErrorMsg("Microphone access denied. Please enable mic permissions.");
            setState("failed");
          }
          return;
        }

        // Initialize Agora Client
        const AgoraRTC = await loadAgoraClient();
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        // Subscribing to Remote Participant
        client.on("user-published", async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "audio" && remoteUser.audioTrack) {
            remoteUser.audioTrack.play();
            if (isMounted) {
              setState("connected");
              if (ringTimerRef.current) {
                clearTimeout(ringTimerRef.current);
                ringTimerRef.current = null;
              }
            }
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

        // Reconnection logic
        client.on("connection-state-change", (curState, revState, reason) => {
          if (curState === "DISCONNECTING" || curState === "DISCONNECTED") {
            if (reconnectAttempts.current < maxReconnects) {
              reconnectAttempts.current += 1;
              setState("reconnecting");
            } else {
              setState("failed");
              setErrorMsg("Persistent network failure. Call disconnected.");
              handleEndCall("network_failure");
            }
          }
        });

        // Join Agora RTC Channel
        await client.join(agoraInfo.app_id, agoraInfo.channel_name, agoraInfo.token, agoraInfo.uid);
        await client.publish([localAudio]);

        if (isMounted) {
          setState("connecting");
        }

      } catch (err) {
        if (isMounted) {
          setErrorMsg(err instanceof Error ? err.message : "Unable to initiate voice call");
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

  // Sync Call Timer with backend CallSession `started_at`
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
    if (clientRef.current) {
      void clientRef.current.leave();
      clientRef.current = null;
    }
  };

  const toggleMute = () => {
    if (localAudioTrackRef.current) {
      if (isMuted) {
        void localAudioTrackRef.current.setEnabled(true);
        setIsMuted(false);
      } else {
        void localAudioTrackRef.current.setEnabled(false);
        setIsMuted(true);
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
    <main className="min-h-screen bg-white">
      <section className="min-h-[calc(100vh-89px)] bg-[linear-gradient(180deg,#2b0442_0%,#5a0c8f_42%,#2b0442_100%)] text-white relative overflow-hidden flex flex-col justify-between">
        
        {/* Top Header & Connection Info */}
        <div className="border-b border-white/10 bg-[#2b0442]/80 backdrop-blur-md px-4 py-5 text-center sm:px-6">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <span className="text-xs tracking-wider font-semibold uppercase text-white/50">1-on-1 Voice Call</span>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${state === "connected" ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"}`} />
              <span className="text-xs font-semibold capitalize tracking-wide">{state}</span>
            </div>
            {state === "connected" && (
              <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                <Wifi size={12} /> {networkQuality}
              </span>
            )}
          </div>
          
          <h1 className="text-[2.2rem] font-bold tracking-tight mt-4 tabular-nums">
            {state === "connected" ? timerText : "--:--"}
          </h1>
          <p className="mt-1 text-xs text-white/60">₹25/Min • Secure Connection</p>
        </div>

        {/* Center Display / Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center relative max-w-sm w-full">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#5a0c8f]/30 rounded-full blur-xl scale-125 animate-pulse" />
              <Image
                src="/images/AudioCallpicture.jpg"
                alt="Profile Avatar"
                width={200}
                height={200}
                className="mx-auto h-[160px] w-[160px] rounded-full object-cover border-4 border-white/20 shadow-2xl relative z-10 sm:h-[190px] sm:w-[190px]"
                unoptimized
              />
            </div>

            <h2 className="mt-6 text-xl font-bold tracking-wide">
              {session?.metadata?.astrologer_name || "Connecting..."}
            </h2>
            <p className="mt-2 text-sm text-white/70">
              {state === "ringing" ? "Ringing participant..." :
               state === "connecting" ? "Setting up channels..." :
               state === "reconnecting" ? "Reconnecting stream..." :
               state === "connected" ? "Voice Session Live" : "Ending call..."}
            </p>

            {errorMsg && (
              <div className="mt-4 mx-auto max-w-xs rounded-xl bg-red-500/20 border border-red-500/30 p-3 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span className="text-left leading-relaxed">{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="border-t border-white/10 bg-[#2b0442]/90 backdrop-blur px-4 py-8 text-center sm:px-6">
          <div className="flex items-center justify-center gap-6 max-w-sm mx-auto">
            
            {/* Mic Mute Button */}
            <button
              type="button"
              onClick={toggleMute}
              disabled={state === "failed" || state === "ended"}
              className={`inline-flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${
                isMuted ? "bg-red-500 border-red-500 text-white" : "border-white/20 bg-white/10 hover:bg-white/20 text-white"
              } disabled:opacity-50`}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* End Call Button */}
            <button
              type="button"
              onClick={() => handleEndCall("user_ended")}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all duration-300 transform active:scale-95"
            >
              <PhoneOff size={22} />
            </button>
          </div>

          <p className="mt-4 text-xs text-white/50 font-medium tracking-wide">
            Remaining balance will be automatically refunded if call ends prematurely
          </p>
        </div>
      </section>
    </main>
  );
}

export default function AudioCall() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#2b0442] flex items-center justify-center text-white font-medium">Initializing call audio...</div>}>
      <AudioCallContent />
    </Suspense>
  );
}
