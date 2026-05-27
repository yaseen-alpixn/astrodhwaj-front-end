"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CirclePlay, Clock3, Eye, Radio, Send, Star, WifiOff, Maximize, Minimize, AlertCircle, LogOut } from "lucide-react";
import type { IAgoraRTCClient, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";

import { formatCurrency, formatDate } from "@/services/api";
import { loadAgoraClient } from "@/services/agora.service";
import { getUserLiveSessions, joinLiveSession, type AgoraJoin, type LiveSession } from "@/services/liveSession.service";
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

type ActiveSession = {
  session: LiveSession;
  agora: AgoraJoin;
};

export default function UserLiveSessionsPage() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [active, setActive] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [chatText, setChatText] = useState("");

  // Custom states
  const [disclaimerTarget, setDisclaimerTarget] = useState<LiveSession | null>(null);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  const remoteVideoRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const activeSessionId = active?.session.id || null;
  const liveSocket = useSocket(activeSessionId ? `/ws/live/${activeSessionId}` : null, "user");

  // Restore persisted state from window/sessionStorage on mount
  useEffect(() => {
    // 1. First, check in-memory window persistence
    if (typeof window !== "undefined" && (window as any).__activeUserStream) {
      const persisted = (window as any).__activeUserStream;
      console.log("Restoring persisted user stream from window.", persisted);
      
      setActive(persisted.active);
      setMessages(persisted.messages || []);
      clientRef.current = persisted.client;
      
      // Re-enable persistence flag
      (window as any).__persistUserStream = true;
      return;
    }

    // 2. If F5 refreshed (window variables wiped, but sessionStorage remains), auto-rejoin!
    const stored = sessionStorage.getItem("active_live_session");
    if (stored) {
      try {
        const sessionData = JSON.parse(stored) as ActiveSession;
        console.log("F5 reload detected. Rejoining active live session from sessionStorage:", sessionData);
        setActive(sessionData);
        if (typeof window !== "undefined") {
          (window as any).__persistUserStream = true;
        }
      } catch (err) {
        console.error("Error parsing stored session:", err);
      }
    }
  }, []);

  // Sync state changes to global window variables for unmount persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__activeUserStreamData = active;
      (window as any).__activeUserMessages = messages;
    }
  }, [active, messages]);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Toggle fullscreen helper
  const toggleFullscreen = () => {
    const container = document.getElementById("user-video-stream-container");
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    getUserLiveSessions({ limit: 40 })
      .then((response) => {
        setSessions(response.data || []);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load live sessions"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const payload = liveSocket.lastMessage as { event?: string; data?: any } | null;
    if (!payload) return;
    if (payload.event === "receive_live_message" && payload.data) {
      const msg = payload.data as LiveMessage;
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
      void handleExitStream();
      alert("The astrologer has ended the live stream broadcast.");
    }
  }, [liveSocket.lastMessage]);

  useEffect(() => {
    if (!active) return;
    let mounted = true;

    // IF RESTORED, SKIP JOINING!
    if (typeof window !== "undefined" && (window as any).__activeUserStream) {
      const client = clientRef.current;
      if (client) {
        console.log("Restored client in useEffect. Setting up event listeners and playing remote tracks.");
        client.removeAllListeners();

        client.on("user-published", async (remoteUser: IAgoraRTCRemoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "video" && remoteUser.videoTrack && remoteVideoRef.current) {
            remoteVideoRef.current.innerHTML = "";
            remoteUser.videoTrack.play(remoteVideoRef.current, { mirror: false });
          }
          if (mediaType === "audio" && remoteUser.audioTrack) {
            remoteUser.audioTrack.play();
          }
        });

        client.on("user-unpublished", (_remoteUser, mediaType) => {
          if (mediaType === "video" && remoteVideoRef.current) {
            remoteVideoRef.current.innerHTML = "";
          }
        });

        // Search for existing host video/audio tracks in the channel
        const host = client.remoteUsers.find(u => u.hasVideo || u.videoTrack);
        if (host && host.videoTrack && remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = "";
          host.videoTrack.play(remoteVideoRef.current, { mirror: false });
        }

        const hostAudio = client.remoteUsers.find(u => u.hasAudio || u.audioTrack);
        if (hostAudio && hostAudio.audioTrack) {
          hostAudio.audioTrack.play();
        }
      }
      return;
    }

    const joinAgora = async () => {
      try {
        const AgoraRTC = await loadAgoraClient();
        const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        clientRef.current = client;
        await client.setClientRole("audience");

        client.on("user-published", async (remoteUser: IAgoraRTCRemoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "video" && remoteUser.videoTrack && remoteVideoRef.current) {
            remoteVideoRef.current.innerHTML = "";
            remoteUser.videoTrack.play(remoteVideoRef.current, { mirror: false });
          }
          if (mediaType === "audio" && remoteUser.audioTrack) {
            remoteUser.audioTrack.play();
          }
        });

        client.on("user-unpublished", (_remoteUser, mediaType) => {
          if (mediaType === "video" && remoteVideoRef.current) {
            remoteVideoRef.current.innerHTML = "";
          }
        });

        await client.join(active.agora.app_id, active.agora.channel_name, active.agora.token, active.agora.uid);
        if (mounted) setError("");
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Unable to join live stream");
      }
    };

    void joinAgora();

    return () => {
      mounted = false;
      const isStillActive = typeof window !== "undefined" && (window as any).__persistUserStream;
      if (isStillActive) {
        if (typeof window !== "undefined") {
          (window as any).__activeUserStream = {
            active: (window as any).__activeUserStreamData,
            client: clientRef.current,
            messages: (window as any).__activeUserMessages,
          };
        }
        console.log("Persisting user stream client in window.");
      } else {
        console.log("Cleaning up user stream client.");
        if (clientRef.current) {
          void clientRef.current.leave();
          clientRef.current = null;
        }
        if (typeof window !== "undefined") {
          (window as any).__activeUserStream = null;
        }
      }
    };
  }, [active]);

  const handleJoin = async (session: LiveSession) => {
    setJoiningId(session.id);
    setError("");
    try {
      const response = await joinLiveSession(session.id);
      const next = response.data;
      sessionStorage.setItem("active_live_session", JSON.stringify(next));
      
      // Set persistence flags
      if (typeof window !== "undefined") {
        (window as any).__persistUserStream = true;
      }

      setMessages([]);
      setActive(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to join live session");
    } finally {
      setJoiningId("");
    }
  };

  const handleJoinClick = (session: LiveSession) => {
    if (session.price && session.price > 0) {
      setDisclaimerTarget(session);
      setDisclaimerChecked(false);
    } else {
      void handleJoin(session);
    }
  };

  const handleExitStream = async () => {
    setError("");
    if (typeof window !== "undefined") {
      (window as any).__persistUserStream = false;
      (window as any).__activeUserStream = null;
    }
    sessionStorage.removeItem("active_live_session");
    if (clientRef.current) {
      try {
        await clientRef.current.leave();
      } catch (err) {
        console.error("Error leaving Agora client:", err);
      }
      clientRef.current = null;
    }
    setActive(null);
    setMessages([]);
  };

  const sendMessage = () => {
    const message = chatText.trim();
    if (!message) return;
    liveSocket.send({ event: "send_message", data: { message } });
    setChatText("");
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Image src="/images/ServerLogo.png" alt="Live sessions" width={20} height={20} className="object-contain" />
        <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-[#111111]">Live Sessions</h1>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {active && (
        <section className="mt-5 overflow-hidden rounded-[18px] border border-[#dddddd] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div id="user-video-stream-container" className="bg-black relative group flex items-center justify-center aspect-video min-h-[260px]">
              <div ref={remoteVideoRef} className="w-full h-full flex items-center justify-center text-sm font-medium text-white/70">
                Waiting for host video...
              </div>
              
              {/* Fullscreen control overlay */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-30 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
            <aside className="flex min-h-[360px] flex-col border-l border-[#eeeeee]">
              <div className="border-b border-[#eeeeee] p-4 flex justify-between items-center gap-2">
                <div>
                  <p className="text-[16px] font-semibold text-[#111111]">{active.session.title}</p>
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                    <span>{liveSocket.connected ? "Connected" : "Reconnecting..."}</span>
                    <span className="inline-flex items-center gap-1 text-[#555555] bg-gray-100 px-2 py-0.5 rounded text-[10px] font-semibold">
                      <Eye size={12} /> {viewerCount} Viewers
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExitStream}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-red-50 px-3 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={13} />
                  Exit
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && <p className="text-xs text-gray-500">No messages yet.</p>}
                {messages.map((message, index) => {
                  const displayName = message.metadata?.sender_name || message.sender_role || "audience";
                  return (
                    <div key={message.id || index} className="rounded-lg bg-[#F7FAFF] px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase text-[#4898E1]">{displayName}</p>
                      <p className="text-sm text-[#232323]">{message.message}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 border-t border-[#eeeeee] p-3">
                <input
                  value={chatText}
                  onChange={(event) => setChatText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                  placeholder="Message"
                  className="h-10 flex-1 rounded-lg border border-[#d9d9d9] px-3 text-sm outline-none focus:border-[#4898E1]"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#4898E1] text-white"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </div>
            </aside>
          </div>
        </section>
      )}

      <section className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading && <p className="text-[13px] font-normal leading-[22px] text-[#232323] tracking-tight">Loading...</p>}
        {!loading && sessions.length === 0 && (
          <div className="rounded-[18px] border border-[#dddddd] bg-white p-6 text-sm text-gray-500">
            No live or upcoming sessions are available right now.
          </div>
        )}
        {sessions.map((session) => {
          const isLive = ["live", "active"].includes(session.status);
          const image = session.thumbnail || String(session.metadata?.image || "") || "/images/HomepageBook.png";
          const astrologerName = String(session.metadata?.astrologer_name || "Astrologer");
          const specialty = String(session.metadata?.specialty || session.category || "Astrology");

          return (
            <article key={session.id} className="w-full overflow-hidden rounded-[18px] border border-[#dddddd] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
              <div className="relative h-[180px]">
                <Image src={image} alt={session.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.48)_100%)]" />
                <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-white ${isLive ? "bg-[#da0000]" : "bg-[#4898E1]"}`}>
                    {isLive ? <Radio size={12} /> : <Clock3 size={12} />}
                    {isLive ? "Live" : "Upcoming"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-[#555555] backdrop-blur-sm">
                    <Eye size={12} />
                    {session.viewer_count || session.viewers_count || 0}
                  </span>
                </div>
                <div className="absolute inset-x-3 bottom-3">
                  <h2 className="text-[16px] font-semibold leading-snug text-white">{session.title}</h2>
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#CCF7FF_0%,#E1E6FF_100%)] text-[14px] font-medium text-[#222222]">
                      {astrologerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#111111]">{astrologerName}</p>
                      <p className="text-[14px] font-medium text-[#505050]">{specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pt-1 text-[#111111]">
                    <Star size={15} className="fill-[#f4c400] text-[#f4c400]" />
                    <span className="text-[12px] font-medium">4.8</span>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-[13px] font-normal leading-[22px] text-[#232323] tracking-tight">
                  {session.description || "Join the astrologer live for real-time guidance and Q&A."}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{session.started_at ? formatDate(session.started_at) : session.status}</span>
                  <span className="font-semibold text-[#111111]">{session.price ? formatCurrency(session.price) : "Free"}</span>
                </div>

                <button
                  type="button"
                  disabled={!isLive || joiningId === session.id}
                  onClick={() => handleJoinClick(session)}
                  className="mt-4 inline-flex h-[38px] w-full items-center justify-center gap-2 rounded-lg bg-[#4898E1] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#3a78b2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {joiningId === session.id ? "Joining..." : isLive ? "Join Session" : "Scheduled"}
                  {isLive ? <CirclePlay size={18} /> : <WifiOff size={16} />}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Paid Stream Disclaimer Modal */}
      {disclaimerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[min(480px,95vw)] rounded-2xl border p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2 text-red-600">
              <AlertCircle size={20} /> Join Paid Live Session
            </h3>
            
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-800">
                Stream Topic: <span className="text-[#4898E1]">{disclaimerTarget.title}</span>
              </p>
              <p className="text-sm font-semibold text-gray-800">
                Rate: <span className="text-[#4898E1]">{formatCurrency(disclaimerTarget.price || 0)}/Minute</span>
              </p>
              
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-xs text-yellow-800 space-y-2">
                <p className="font-bold">⚠️ IMPORTANT WALLET DEDUCTION DISCLAIMER:</p>
                <p className="leading-relaxed">
                  By joining this live broadcast, you confirm and agree that the live session charges will be debited from your wallet balance.
                </p>
                <p className="leading-relaxed font-semibold">
                  Even if you join for just ONE SECOND, 10 seconds, or 59 seconds, the minimum per-minute amount will be deducted. Please ensure you agree to this billing policy before proceeding.
                </p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={disclaimerChecked}
                  onChange={(e) => setDisclaimerChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#4898E1] focus:ring-[#4898E1]"
                />
                <span className="text-xs font-semibold text-gray-700 leading-snug">
                  I confirm that I understand and agree that wallet balance will be debited immediately upon joining, even for a single second.
                </span>
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setDisclaimerTarget(null)}
                className="h-10 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!disclaimerChecked}
                onClick={() => {
                  if (disclaimerTarget) {
                    void handleJoin(disclaimerTarget);
                    setDisclaimerTarget(null);
                  }
                }}
                className="h-10 px-6 rounded-lg bg-[#4898E1] hover:bg-[#3d83c2] text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm & Join Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
