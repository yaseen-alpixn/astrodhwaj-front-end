"use client";

import { useEffect, useRef, useState } from "react";
import { X, Eye, ShieldAlert, LogOut, Wifi, AlertTriangle } from "lucide-react";
import type { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { loadAgoraClient } from "@/services/agora.service";
import { adminApi, titleCase } from "../api";
import { joinLiveSession, type LiveSession, type AgoraJoin } from "@/services/liveSession.service";
import { useSocket } from "@/hooks/useSocket";

type LiveMessage = {
  id?: string;
  message?: string;
  sender_role?: string;
  created_at?: string;
  metadata?: {
    sender_name?: string;
  };
};

type MonitorLiveModalProps = {
  sessionId?: string;
  onClose: () => void;
};

export default function MonitorLiveModal({ sessionId, onClose }: MonitorLiveModalProps) {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [agora, setAgora] = useState<AgoraJoin | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [streamState, setStreamState] = useState<"connecting" | "connected" | "ended">("connecting");

  const remoteVideoRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);

  const liveSocket = useSocket(sessionId ? `/ws/live/${sessionId}` : null, "admin");

  // Load stream chat comments and viewer logs
  useEffect(() => {
    const payload = liveSocket.lastMessage as { event?: string; data?: any } | null;
    if (!payload) return;
    if (payload.event === "receive_live_message" && payload.data) {
      const msg = payload.data;
      setMessages((current) => {
        if (current.some((m) => m.id === msg.id || (m.message === msg.message && m.created_at === msg.created_at))) {
          return current;
        }
        return [...current, msg];
      });
    } else if (payload.event === "viewer_count_update" && payload.data) {
      if (typeof payload.data.count === "number") {
        setViewerCount(payload.data.count);
      } else if (typeof payload.data.delta === "number") {
        setViewerCount((current) => Math.max(0, current + payload.data.delta));
      }
    } else if (payload.event === "live_session_ended") {
      // The astrologer has ended the broadcast — close this monitor modal cleanly
      setStreamState("ended");
      if (clientRef.current) {
        void clientRef.current.leave().catch(() => {});
        clientRef.current = null;
      }
      alert("The astrologer has ended this live broadcast. The monitor is closing.");
      onClose();
    }
  }, [liveSocket.lastMessage]);


  // Join Agora stream as Audience
  useEffect(() => {
    if (!sessionId) return;
    let isMounted = true;

    // Join endpoint (Admins bypass charge logic in backend)
    joinLiveSession(sessionId, "admin")
      .then(async (response) => {
        if (!isMounted) return;
        setSession(response.data.session);
        setAgora(response.data.agora);
        setViewerCount(0);

        try {
          const AgoraRTC = await loadAgoraClient();
          const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
          clientRef.current = client;

          await client.setClientRole("audience");

          client.on("user-published", async (remoteUser, mediaType) => {
            await client.subscribe(remoteUser, mediaType);
            if (mediaType === "video" && remoteUser.videoTrack && remoteVideoRef.current) {
              remoteVideoRef.current.innerHTML = "";
              remoteUser.videoTrack.play(remoteVideoRef.current, { mirror: false });
              if (isMounted) setStreamState("connected");
            }
            if (mediaType === "audio" && remoteUser.audioTrack) {
              remoteUser.audioTrack.play();
            }
          });

          client.on("user-unpublished", (remoteUser, mediaType) => {
            if (mediaType === "video" && remoteVideoRef.current) {
              remoteVideoRef.current.innerHTML = "";
            }
          });

          await client.join(response.data.agora.app_id, response.data.agora.channel_name, response.data.agora.token, response.data.agora.uid);
          setErrorMsg("");
        } catch (err) {
          if (isMounted) {
            setErrorMsg("RTC client subscription handshake failed.");
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg(err instanceof Error ? err.message : "Unable to audit live session");
        }
      });

    return () => {
      isMounted = false;
      if (clientRef.current) {
        void clientRef.current.leave();
      }
    };
  }, [sessionId]);

  const terminateSession = () => {
    if (!sessionId) return;
    setStreamState("ended");
    adminApi(`/admin/live-sessions/${sessionId}/end`, { method: "PATCH" })
      .then(() => onClose())
      .catch(() => onClose());
  };

  const sendMonitorComment = () => {
    const text = chatText.trim();
    if (!text) return;
    liveSocket.send({ event: "send_message", data: { message: `[Admin Alert]: ${text}` } });
    setChatText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-[DM_Sans] text-white">
      <div className="flex flex-col lg:flex-row max-h-[85vh] w-[min(1000px,95vw)] overflow-hidden rounded-2xl bg-gray-950 shadow-2xl border border-white/15">
        
        {/* Left Side: Video Monitor Box */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 relative bg-black">
          {/* Header controls overlay */}
          <div className="absolute top-4 inset-x-4 z-20 flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/5 backdrop-blur">
            <div>
              <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse mr-2">MONITORING</span>
              <span className="text-sm font-semibold">{session?.title || "Stream Feed"}</span>
            </div>
            
            <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Stream Render View */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 relative flex items-center justify-center bg-gray-900 min-h-[300px] mt-16">
            <div ref={remoteVideoRef} className="w-full h-full object-cover" />
            {streamState === "connecting" && (
              <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-4">
                <AlertTriangle size={32} className="text-yellow-500 animate-bounce mb-3" />
                <p className="text-xs text-white/70">Connecting to secure stream channel feed...</p>
                {errorMsg && <p className="text-red-400 mt-2 text-xs">{errorMsg}</p>}
              </div>
            )}
          </div>

          {/* Administrative actions bar */}
          <div className="flex justify-between items-center bg-gray-900 border border-white/5 rounded-xl p-4 mt-4">
            <div className="flex items-center gap-4 text-xs font-semibold text-white/80">
              <span className="flex items-center gap-1"><Eye size={14} /> {viewerCount} Viewers watching</span>
              <span className="bg-white/10 px-2 py-0.5 rounded">{session?.category || "Live"}</span>
            </div>


            <button onClick={terminateSession} className="bg-red-600 hover:bg-red-700 h-10 px-5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
              <ShieldAlert size={14} /> Terminate Broadcast
            </button>
          </div>
        </div>

        {/* Right Side: Chat logs and alerts */}
        <aside className="w-full lg:w-[320px] bg-gray-900 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col justify-between max-h-[300px] lg:max-h-none">
          <div className="p-4 border-b border-white/5">
            <h3 className="font-semibold text-xs text-white/85">Live Comments Stream</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && <p className="text-xs text-white/30 text-center py-6">No chat comments logged</p>}
            {messages.map((item, index) => {
              const displayName = item.metadata?.sender_name || item.sender_role || "User";
              return (
                <div key={index} className="rounded bg-white/5 p-2.5 text-[11px] leading-relaxed border border-white/5">
                  <span className="font-bold text-[#4898E1] uppercase mr-1">{displayName}:</span>
                  <span className="text-white/85">{item.message}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-white/5 flex gap-2">
            <input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMonitorComment()}
              placeholder="Post alert message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#4898E1]"
            />
            <button onClick={sendMonitorComment} className="bg-blue-600 hover:bg-blue-700 px-3 rounded-lg flex items-center justify-center transition-colors">
              <LogOut size={13} className="rotate-180" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
