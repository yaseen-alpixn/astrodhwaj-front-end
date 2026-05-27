"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Radio, Calendar, Plus, Clock, Eye, Trash2, Camera, VideoOff, Mic, MicOff, Send, LogOut, AlertCircle, RefreshCw, Maximize, Minimize, Monitor, MonitorOff, X } from "lucide-react";
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { loadAgoraClient } from "@/services/agora.service";
import { api } from "@/services/api";
import { getAstrologerLiveSessions, createLiveSession, startLiveSession, endLiveSession, resetSessionLock, deleteLiveSession, type LiveSession, type AgoraJoin } from "@/services/liveSession.service";
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

type StreamState = "dashboard" | "studio";

export default function LiveDashboard() {
  const [viewState, setViewState] = useState<StreamState>("dashboard");
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [active, setActive] = useState<{ session: LiveSession; agora: AgoraJoin } | null>(null);
  
  // Create / Schedule Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Vedic");
  const [price, setPrice] = useState("0");
  const [scheduledAt, setScheduledAt] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  
  // Error handling states
  const [errorMsg, setErrorMsg] = useState("");
  const [showLockReset, setShowLockReset] = useState(false);
  const [isResettingLock, setIsResettingLock] = useState(false);
  const [conflictError, setConflictError] = useState<{ message: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LiveSession | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  
  // Studio State
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [chatText, setChatText] = useState("");
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  // Screen Sharing & Fullscreen States
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Viewers states
  const [isViewersModalOpen, setIsViewersModalOpen] = useState(false);
  const [viewersList, setViewersList] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [isLoadingViewers, setIsLoadingViewers] = useState(false);

  const openViewersModal = async () => {
    if (!active?.session.id) return;
    setIsViewersModalOpen(true);
    setIsLoadingViewers(true);
    try {
      const response = await api<Array<{ id: string; name: string; email: string; role: string }>>(
        `/astrologer/live-sessions/${active.session.id}/viewers`,
        {},
        "astrologer"
      );
      setViewersList(response.data || []);
    } catch (err) {
      console.error("Failed to load active viewers:", err);
    } finally {
      setIsLoadingViewers(false);
    }
  };

  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const audioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const videoTrackRef = useRef<ICameraVideoTrack | null>(null); // Active video track (camera or screen)
  const cameraTrackRef = useRef<ICameraVideoTrack | null>(null);
  const screenTrackRef = useRef<any | null>(null);

  const activeSessionId = active?.session.id || null;
  const liveSocket = useSocket(activeSessionId ? `/ws/live/${activeSessionId}` : null, "astrologer");

  // Restore persisted live broadcast from window/sessionStorage on mount
  useEffect(() => {
    // 1. Check window first
    if (typeof window !== "undefined" && (window as any).__activeLiveBroadcast) {
      const persisted = (window as any).__activeLiveBroadcast;
      console.log("Restoring persisted live broadcast from window.", persisted);

      setActive(persisted.active);
      setViewState("studio");
      setIsMicMuted(persisted.isMicMuted);
      setIsVideoMuted(persisted.isVideoMuted);
      setIsSharingScreen(persisted.isSharingScreen);
      setMessages(persisted.messages || []);
      setViewerCount(persisted.viewerCount || 0);

      clientRef.current = persisted.client;
      audioTrackRef.current = persisted.audioTrack;
      videoTrackRef.current = persisted.videoTrack;
      cameraTrackRef.current = persisted.cameraTrack;
      screenTrackRef.current = persisted.screenTrack;

      // Make sure persistence remains active
      (window as any).__persistBroadcast = true;

      // Play video track immediately in the restored element
      setTimeout(() => {
        if (persisted.videoTrack && localVideoRef.current) {
          localVideoRef.current.innerHTML = "";
          persisted.videoTrack.play(localVideoRef.current);
        }
      }, 300);
      return;
    }

    // 2. Check F5 reload session from sessionStorage
    const stored = sessionStorage.getItem("active_astrologer_broadcast");
    if (stored) {
      try {
        const broadcastData = JSON.parse(stored) as { session: LiveSession; agora: AgoraJoin };
        console.log("F5 reload detected. Rejoining active astrologer broadcast from sessionStorage:", broadcastData);
        
        setActive(broadcastData);
        setViewState("studio");
        if (typeof window !== "undefined") {
          (window as any).__persistBroadcast = true;
        }
      } catch (err) {
        console.error("Error parsing stored broadcast:", err);
      }
    }
  }, []);

  // Sync state changes to global window variables for unmount persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__activeLiveBroadcastData = active;
      (window as any).__activeIsSharingScreen = isSharingScreen;
      (window as any).__activeIsMicMuted = isMicMuted;
      (window as any).__activeIsVideoMuted = isVideoMuted;
      (window as any).__activeMessages = messages;
      (window as any).__activeViewerCount = viewerCount;
    }
  }, [active, isSharingScreen, isMicMuted, isVideoMuted, messages, viewerCount]);

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
    const container = document.getElementById("video-stream-container");
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Screen Sharing Helpers
  const toggleScreenShare = async () => {
    if (!active || !clientRef.current) return;

    const AgoraRTC = await loadAgoraClient();

    try {
      if (!isSharingScreen) {
        console.log("Starting screen share...");
        const screenResult = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: "1080p_1",
          optimizationMode: "detail"
        }, "auto");

        const screenTrack = Array.isArray(screenResult) ? screenResult[0] : screenResult;
        screenTrackRef.current = screenTrack;

        // Unpublish camera video if published
        if (cameraTrackRef.current && clientRef.current) {
          await clientRef.current.unpublish(cameraTrackRef.current);
        }

        // Publish screen track
        await clientRef.current.publish(screenTrack);
        videoTrackRef.current = screenTrack as any;

        // Set native stop sharing listener
        screenTrack.on("track-ended", () => {
          void stopScreenShare();
        });

        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = "";
          screenTrack.play(localVideoRef.current);
        }

        setIsSharingScreen(true);
      } else {
        await stopScreenShare();
      }
    } catch (err) {
      console.error("Failed to share screen:", err);
      alert("Failed to share screen: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const stopScreenShare = async () => {
    if (!clientRef.current) return;

    try {
      console.log("Stopping screen share...");
      if (screenTrackRef.current) {
        await clientRef.current.unpublish(screenTrackRef.current);
        screenTrackRef.current.stop();
        screenTrackRef.current.close();
        screenTrackRef.current = null;
      }

      if (cameraTrackRef.current) {
        await clientRef.current.publish(cameraTrackRef.current);
        videoTrackRef.current = cameraTrackRef.current;

        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = "";
          cameraTrackRef.current.play(localVideoRef.current);
        }
      }

      setIsSharingScreen(false);
    } catch (err) {
      console.error("Failed to stop screen share:", err);
    }
  };

  // Load stream list
  useEffect(() => {
    getAstrologerLiveSessions()
      .then((res) => setSessions(res.data || []))
      .catch(() => setSessions([]));
  }, [viewState]);

  // Listen to WebSocket Live Chat & Viewer Presence
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
    }
  }, [liveSocket.lastMessage]);

  // Publish local webcam & mic in Studio mode
  useEffect(() => {
    if (viewState !== "studio" || !active) return;

    // IF ALREADY RESTORED, SKIP SETUP!
    if (typeof window !== "undefined" && (window as any).__activeLiveBroadcast) {
      console.log("Studio already restored, skipping RTC setup.");
      if (videoTrackRef.current && localVideoRef.current) {
        localVideoRef.current.innerHTML = "";
        videoTrackRef.current.play(localVideoRef.current);
      }
      return;
    }

    let mounted = true;

    const setupRTC = async () => {
      try {
        const AgoraRTC = await loadAgoraClient();
        const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        clientRef.current = client;

        await client.setClientRole("host");

        // Create mic & webcam tracks
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        audioTrackRef.current = audioTrack;
        cameraTrackRef.current = videoTrack;
        videoTrackRef.current = videoTrack;

        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = "";
          videoTrack.play(localVideoRef.current);
        }

        await client.join(active.agora.app_id, active.agora.channel_name, active.agora.token, active.agora.uid);
        await client.publish([audioTrack, videoTrack]);
      } catch (err) {
        console.error("Agora host setup error:", err);
      }
    };

    void setupRTC();

    return () => {
      mounted = false;
      const isStillActive = typeof window !== "undefined" && (window as any).__persistBroadcast;
      if (isStillActive) {
        if (typeof window !== "undefined") {
          (window as any).__activeLiveBroadcast = {
            active: (window as any).__activeLiveBroadcastData,
            client: clientRef.current,
            audioTrack: audioTrackRef.current,
            videoTrack: videoTrackRef.current,
            cameraTrack: cameraTrackRef.current,
            screenTrack: screenTrackRef.current,
            isSharingScreen: (window as any).__activeIsSharingScreen,
            isMicMuted: (window as any).__activeIsMicMuted,
            isVideoMuted: (window as any).__activeIsVideoMuted,
            messages: (window as any).__activeMessages,
            viewerCount: (window as any).__activeViewerCount,
          };
        }
        console.log("Persisting broadcast tracks in window object.");
      } else {
        console.log("Cleaning up broadcast tracks.");
        if (audioTrackRef.current) {
          audioTrackRef.current.stop();
          audioTrackRef.current.close();
          audioTrackRef.current = null;
        }
        if (videoTrackRef.current) {
          videoTrackRef.current.stop();
          videoTrackRef.current.close();
          videoTrackRef.current = null;
        }
        if (cameraTrackRef.current) {
          cameraTrackRef.current.stop();
          cameraTrackRef.current.close();
          cameraTrackRef.current = null;
        }
        if (screenTrackRef.current) {
          screenTrackRef.current.stop();
          screenTrackRef.current.close();
          screenTrackRef.current = null;
        }
        if (clientRef.current) {
          void clientRef.current.leave();
          clientRef.current = null;
        }
        if (typeof window !== "undefined") {
          (window as any).__activeLiveBroadcast = null;
        }
      }
    };
  }, [viewState, active]);

  // Handle Thumbnail File Upload to Cloudinary
  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploadingThumbnail(true);
      const response = await api<{ url: string }>("/upload/image?category=content_image", {
        method: "POST",
        body: formData,
      }, "astrologer");
      setThumbnail(response.data.url);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  // Launch stream instantly or schedule
  const handleLaunchStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      category,
      price: parseFloat(price),
      thumbnail,
      status: isScheduled ? "scheduled" : "live",
      scheduled_at: isScheduled ? new Date(scheduledAt).toISOString() : undefined,
    };

    try {
      setErrorMsg("");
      setShowLockReset(false);
      
      if (isScheduled) {
        await createLiveSession(payload);
        setIsModalOpen(false);
        resetForm();
        getAstrologerLiveSessions().then((res) => setSessions(res.data || []));
      } else {
        const createRes = await createLiveSession({ ...payload, status: "live" });
        const startRes = await startLiveSession(createRes.data.id);
        if (typeof window !== "undefined") {
          (window as any).__persistBroadcast = true;
        }
        sessionStorage.setItem("active_astrologer_broadcast", JSON.stringify(startRes.data));
        setActive(startRes.data);
        setMessages([]);
        setViewState("studio");
        setIsModalOpen(false);
      }
    } catch (err: any) {
      const msg = err.message || "Failed to start session";
      if (msg.toLowerCase().includes("active session") || msg.toLowerCase().includes("lock")) {
        setConflictError({ message: msg });
        setIsModalOpen(false);
      } else {
        setErrorMsg(msg);
      }
    }
  };

  // Reset Lock Handler
  const handleResetLock = async () => {
    try {
      setIsResettingLock(true);
      await resetSessionLock();
      setConflictError(null);
      setErrorMsg("");
      getAstrologerLiveSessions().then((res) => setSessions(res.data || []));
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset session lock");
    } finally {
      setIsResettingLock(false);
    }
  };

  const handleStartScheduled = async (session: LiveSession) => {
    try {
      setErrorMsg("");
      setShowLockReset(false);
      const startRes = await startLiveSession(session.id);
      if (typeof window !== "undefined") {
        (window as any).__persistBroadcast = true;
      }
      sessionStorage.setItem("active_astrologer_broadcast", JSON.stringify(startRes.data));
      setActive(startRes.data);
      setMessages([]);
      setViewState("studio");
    } catch (err: any) {
      const msg = err.message || "Failed to start session";
      if (msg.toLowerCase().includes("active session") || msg.toLowerCase().includes("lock")) {
        setConflictError({ message: msg });
      } else {
        setErrorMsg(msg);
      }
    }
  };

  const handleDeleteSession = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteLiveSession(deleteTarget.id);
      setDeleteTarget(null);
      const res = await getAstrologerLiveSessions();
      setSessions(res.data || []);
    } catch (err: any) {
      console.error("Delete session failed:", err);
      alert(err.message || "Failed to delete scheduled stream");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("0");
    setThumbnail("");
    setScheduledAt("");
    setIsScheduled(false);
    setErrorMsg("");
    setShowLockReset(false);
  };

  const endStream = () => {
    if (!active?.session.id) return;
    if (typeof window !== "undefined") {
      (window as any).__persistBroadcast = false;
      (window as any).__activeLiveBroadcast = null;
    }
    sessionStorage.removeItem("active_astrologer_broadcast");
    endLiveSession(active.session.id)
      .then(() => {
        setViewState("dashboard");
        setActive(null);
      })
      .catch(() => {
        setViewState("dashboard");
        setActive(null);
      });
  };

  const sendStudioChatMessage = () => {
    const text = chatText.trim();
    if (!text) return;
    liveSocket.send({ event: "send_message", data: { message: text } });
    setChatText("");
  };

  const toggleMic = () => {
    if (audioTrackRef.current) {
      if (isMicMuted) {
        void audioTrackRef.current.setEnabled(true);
        setIsMicMuted(false);
      } else {
        void audioTrackRef.current.setEnabled(false);
        setIsMicMuted(true);
      }
    }
  };

  const toggleVideo = () => {
    if (videoTrackRef.current) {
      if (isVideoMuted) {
        void videoTrackRef.current.setEnabled(true);
        setIsVideoMuted(false);
      } else {
        void videoTrackRef.current.setEnabled(false);
        setIsVideoMuted(true);
      }
    }
  };

  if (viewState === "studio") {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-gray-950 flex flex-col lg:flex-row text-white font-[DM_Sans]">
        {/* Left Side: Video Stream Studio */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-black relative">
          
          {/* Header controls overlay */}
          <div className="absolute top-6 inset-x-6 z-20 flex justify-between items-center bg-black/40 p-4 rounded-xl backdrop-blur-sm border border-white/5">
            <div>
              <span className="bg-red-600 text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold animate-pulse mr-2">LIVE</span>
              <span className="text-sm font-semibold">{active?.session.title}</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-white/80">
              <button 
                type="button" 
                onClick={openViewersModal} 
                className="flex items-center gap-1.5 hover:underline text-white font-semibold transition-all focus:outline-none"
                title="View active viewers list"
              >
                <Eye size={15} /> {viewerCount} Viewers
              </button>
              <span className="bg-white/15 px-2.5 py-1 rounded-full">{active?.session.price ? `₹${active.session.price}/Min` : "Free Stream"}</span>
            </div>
          </div>

          {/* Large Video Preview Container */}
          <div id="video-stream-container" className="flex-1 rounded-[24px] overflow-hidden border border-white/10 relative flex items-center justify-center bg-gray-900 mt-20 group">
            <div ref={localVideoRef} className="w-full h-full object-cover" />
            {isVideoMuted && (
              <div className="absolute inset-0 bg-gray-950/90 flex flex-col items-center justify-center text-white/50 z-10">
                <VideoOff size={40} className="mb-2" />
                <span>Webcam feed disabled</span>
              </div>
            )}
            
            {/* Fullscreen button overlay */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-30 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>

          {/* Bottom Stream controls bar */}
          <div className="flex justify-between items-center bg-gray-900/80 backdrop-blur border border-white/5 rounded-xl p-4 mt-4 relative z-20">
            <div className="flex gap-3">
              <button onClick={toggleMic} className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all ${isMicMuted ? "bg-red-500 border-red-500" : "border-white/20 bg-white/5 hover:bg-white/15"}`} title={isMicMuted ? "Unmute Mic" : "Mute Mic"}>
                {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button onClick={toggleVideo} className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all ${isVideoMuted ? "bg-red-500 border-red-500" : "border-white/20 bg-white/5 hover:bg-white/15"}`} title={isVideoMuted ? "Enable Camera" : "Disable Camera"}>
                {isVideoMuted ? <VideoOff size={18} /> : <Camera size={18} />}
              </button>
              <button onClick={toggleScreenShare} className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all ${isSharingScreen ? "bg-blue-600 border-blue-600" : "border-white/20 bg-white/5 hover:bg-white/15"}`} title={isSharingScreen ? "Stop Screen Share" : "Share Screen"}>
                {isSharingScreen ? <MonitorOff size={18} /> : <Monitor size={18} />}
              </button>
            </div>
            
            <button onClick={endStream} className="bg-red-600 hover:bg-red-700 h-11 px-6 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
              <LogOut size={16} /> End Live Broadcast
            </button>
          </div>
        </div>

        {/* Right Side: Chat Console */}
        <aside className="w-full lg:w-[350px] bg-gray-900 border-l border-white/5 flex flex-col justify-between">
          <div className="p-4 border-b border-white/5">
            <h3 className="font-semibold text-sm tracking-wide">Studio Chat Feed</h3>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] lg:max-h-none">
            {messages.length === 0 && <p className="text-xs text-white/30 text-center py-10">No audience chats yet</p>}
            {messages.map((item, index) => {
              const displayName = item.metadata?.sender_name || item.sender_role || "audience";
              return (
                <div key={index} className="rounded-lg bg-white/5 p-3 text-xs leading-relaxed border border-white/5">
                  <span className="font-bold text-[#4898E1] uppercase mr-1">{displayName}:</span>
                  <span className="text-white/80">{item.message}</span>
                </div>
              );
            })}
          </div>

          {/* Send Box */}
          <div className="p-4 border-t border-white/5 flex gap-2">
            <input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendStudioChatMessage()}
              placeholder="Post a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#4898E1]"
            />
            <button onClick={sendStudioChatMessage} className="bg-[#4898E1] hover:bg-[#3d83c2] px-3.5 rounded-lg flex items-center justify-center transition-colors">
              <Send size={15} />
            </button>
          </div>
        </aside>

        {/* Active Viewers Modal */}
        {isViewersModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm">
            <div className="bg-white text-gray-800 w-[min(420px,95vw)] rounded-2xl border p-5 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Eye size={16} className="text-[#4898E1]" /> Active Viewers List
                </h3>
                <button onClick={() => setIsViewersModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[280px] overflow-y-auto space-y-2">
                {isLoadingViewers && (
                  <p className="text-xs text-gray-500 py-6 text-center">Loading active viewers...</p>
                )}
                {!isLoadingViewers && viewersList.length === 0 && (
                  <p className="text-xs text-gray-500 py-6 text-center">No active viewers currently connected.</p>
                )}
                {!isLoadingViewers && viewersList.map((viewer) => (
                  <div key={viewer.id} className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{viewer.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{viewer.email}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E1F2FF] text-[#4898E1] uppercase tracking-wider">
                      {viewer.role}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsViewersModalOpen(false)}
                  className="h-9 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard layout
  return (
    <div className="space-y-6 px-4 md:px-6 py-6 font-[DM_Sans]">
      
      {/* Top Banner section */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start w-full">
        <div className="w-full rounded-[20px] p-6 bg-gradient-to-r from-[#0180D5] to-[#0040C1] text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[220px]">
          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase">
              <Radio size={14} className="animate-pulse" /> Live Stream Manager
            </span>
            <h2 className="text-2xl font-bold tracking-wide">Go Live & Teach</h2>
            <p className="text-white/80 text-xs leading-relaxed max-w-lg">
              Deliver daily guidance, read horoscopes, and host live Q&A sessions. Broadcast directly via your webcam.
            </p>
          </div>

          <div className="relative z-10 flex gap-4 mt-6">
            <button onClick={() => { setIsScheduled(false); setIsModalOpen(true); setErrorMsg(""); setShowLockReset(false); }} className="bg-white text-[#0040C1] hover:bg-gray-100 px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow">
              <Plus size={16} /> Go Live Instantly
            </button>
            <button onClick={() => { setIsScheduled(true); setIsModalOpen(true); setErrorMsg(""); setShowLockReset(false); }} className="bg-white/10 border border-white/20 text-white hover:bg-white/15 px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
              <Calendar size={16} /> Schedule Stream
            </button>
          </div>

          <div className="absolute top-0 right-0 w-[140px] h-[140px] bg-white/5 rounded-full scale-125 translate-x-10 -translate-y-10" />
        </div>

        {/* Earning Stats Card grid */}
        <div className="grid grid-cols-2 gap-4 w-full xl:max-w-[450px]">
          {[
            { title: "Total Streams", count: sessions.length, bg: "bg-yellow-50 border-yellow-100 text-yellow-800" },
            { title: "Earnings Earned", count: "₹6,340", bg: "bg-green-50 border-green-100 text-green-800" },
            { title: "Active Viewers", count: "0 Active", bg: "bg-blue-50 border-blue-100 text-blue-800" },
            { title: "Average Stream", count: "45m", bg: "bg-purple-50 border-purple-100 text-purple-800" },
          ].map((item, index) => (
            <div key={index} className={`border rounded-[18px] p-4 flex flex-col justify-between shadow-sm ${item.bg}`}>
              <span className="text-[11px] font-semibold uppercase opacity-75">{item.title}</span>
              <span className="text-xl font-bold mt-2 tracking-tight">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Broadcasts Section */}
      {sessions.filter(s => s.status === "live" || s.status === "active").length > 0 && (
        <section className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-[20px] p-5 shadow-sm">
          <h2 className="text-sm font-bold text-red-900 mb-3 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            Active Live Broadcasts
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.filter(s => s.status === "live" || s.status === "active").map((session) => (
              <div key={session.id} className="border border-red-100 bg-white rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-red-300 transition-colors">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
                      {session.status}
                    </span>
                    <span className="font-bold text-xs text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                      {session.price ? `₹${session.price}/Min` : "Free"}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-gray-900 leading-snug">{session.title}</h3>
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={11} /> Started: {session.started_at ? new Date(session.started_at).toLocaleString("en-IN") : "Just now"}
                  </p>
                </div>

                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  <button
                    onClick={() => handleStartScheduled(session)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
                  >
                    <Radio size={12} className="animate-pulse" />
                    Resume Studio
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await endLiveSession(session.id);
                        const res = await getAstrologerLiveSessions();
                        setSessions(res.data || []);
                      } catch (err: any) {
                        alert(err.message || "Failed to end stream");
                      }
                    }}
                    className="border border-gray-200 hover:border-red-200 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-[10px] font-semibold transition-all active:scale-[0.98]"
                  >
                    End Broadcast
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main List Panels */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Scheduled Streams / active streams */}
        <section className="bg-white border rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-1.5"><Calendar size={18} className="text-blue-500" /> Upcoming Scheduled streams</h2>
          <div className="space-y-3">
            {sessions.filter(s => s.status === "scheduled").map((session) => (
              <div key={session.id} className="border rounded-xl p-4 bg-gray-50 flex justify-between items-center gap-4 hover:border-gray-300 transition-colors">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{session.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock size={12} /> {session.scheduled_at ? new Date(session.scheduled_at).toLocaleString("en-IN") : "-"}</span>
                    <span className="font-semibold text-gray-800">{session.price ? `₹${session.price}/Min` : "Free"}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleStartScheduled(session)} className="bg-[#4898E1] hover:bg-[#3d83c2] px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:scale-[1.02] shadow-sm">
                    Go Live
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(session)} className="border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-all hover:scale-[1.02] flex items-center justify-center" title="Cancel Scheduled Stream">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {sessions.filter(s => s.status === "scheduled").length === 0 && (
              <p className="text-xs text-gray-500 py-6 text-center">No scheduled streams yet.</p>
            )}
          </div>
        </section>

        {/* History / past streams */}
        <section className="bg-white border rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-1.5"><Clock size={18} className="text-purple-500" /> My Past Stream Logs</h2>
          <div className="space-y-3">
            {sessions.filter(s => s.status === "ended").map((session) => (
              <div key={session.id} className="border rounded-xl p-3 bg-gray-50 text-xs">
                <h3 className="font-semibold text-gray-900">{session.title}</h3>
                <p className="text-gray-500 mt-1">Ended: {session.ended_at ? new Date(session.ended_at).toLocaleDateString() : "-"}</p>
                <div className="flex gap-4 mt-2 font-medium text-gray-600">
                  <span>Viewers: {session.viewer_count || 0}</span>
                  <span className="text-green-600">Revenue: ₹{session.revenue || 0}</span>
                </div>
              </div>
            ))}
            {sessions.filter(s => s.status === "ended").length === 0 && (
              <p className="text-xs text-gray-500 py-6 text-center">No past streams logged.</p>
            )}
          </div>
        </section>
      </div>

      {/* Start / Schedule Live Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleLaunchStream} className="bg-white w-[min(480px,95vw)] rounded-2xl border p-5 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
              {isScheduled ? "Schedule Upcoming Stream" : "Setup Instant Live Stream"}
            </h3>

            {/* Error alerts / session lock warnings */}
            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle size={16} />
                  <span>Stream Launch Blocked</span>
                </div>
                <p className="leading-relaxed font-medium">{errorMsg}</p>
                
                {showLockReset && (
                  <button
                    type="button"
                    onClick={handleResetLock}
                    disabled={isResettingLock}
                    className="w-full h-9 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 mt-2 text-xs uppercase"
                  >
                    <RefreshCw size={13} className={isResettingLock ? "animate-spin" : ""} />
                    {isResettingLock ? "Resetting Lock..." : "Force Reset Active Lock"}
                  </button>
                )}
              </div>
            )}

            <div className="space-y-3 text-xs font-semibold text-gray-700">
              <div>
                <label className="block mb-1">Stream Topic / Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Morning Horoscope Guidance" className="w-full h-10 border rounded-lg px-3 outline-none" required />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the topics you will cover" className="w-full min-h-16 border rounded-lg p-3 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-10 border rounded-lg px-2 outline-none">
                    <option value="Vedic">Vedic Astrology</option>
                    <option value="Tarot">Tarot Reading</option>
                    <option value="Numerology">Numerology</option>
                    <option value="Vastu">Vastu Consult</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Rate per Minute (₹) *</label>
                  <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-10 border rounded-lg px-3 outline-none" />
                </div>
              </div>

              {isScheduled && (
                <div>
                  <label className="block mb-1">Date & Time *</label>
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full h-10 border rounded-lg px-3 outline-none" required={isScheduled} />
                </div>
              )}

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-gray-700">Cover Thumbnail Image</label>
                
                {isUploadingThumbnail ? (
                  <div className="w-full h-32 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={20} className="text-[#4898E1] animate-spin" />
                    <span className="text-[10px] text-gray-500 font-medium">Uploading cover image...</span>
                  </div>
                ) : thumbnail ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 group shadow-sm bg-gray-100">
                    <Image 
                      src={thumbnail} 
                      alt="Cover Thumbnail Preview" 
                      fill 
                      style={{ objectFit: "cover" }} 
                      className="transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => document.getElementById("thumbnail-file-input")?.click()}
                        className="bg-white/95 hover:bg-white text-gray-800 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all hover:scale-105 active:scale-95 shadow"
                      >
                        Change Cover
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbnail("")}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all hover:scale-105 active:scale-95 shadow"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => document.getElementById("thumbnail-file-input")?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-[#4898E1] bg-gray-50 hover:bg-[#4898E1]/5 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group text-center"
                  >
                    <Camera size={22} className="text-gray-400 group-hover:text-[#4898E1] mb-1.5 transition-colors" />
                    <span className="text-[11px] font-bold text-gray-700 group-hover:text-[#4898E1] transition-colors">Click to Upload Cover Image</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">Ratio: 16:9 recommended (PNG, JPG)</span>
                  </div>
                )}
                
                <input 
                  type="file" 
                  id="thumbnail-file-input" 
                  accept="image/*" 
                  onChange={handleThumbnailUpload} 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t">
              <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="h-10 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold">Cancel</button>
              <button type="submit" className="h-10 px-6 rounded-lg bg-[#4898E1] hover:bg-[#3d83c2] text-xs font-semibold text-white">
                {isScheduled ? "Confirm Schedule" : "Go Live Now"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Premium Conflict Lock Warning Dialog */}
      {conflictError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="bg-gray-950 text-white w-[min(480px,95vw)] rounded-3xl border border-red-500/30 p-6 shadow-[0_0_50px_rgba(239,68,68,0.15)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/10 rounded-full blur-[60px]" />
            
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="h-16 w-16 rounded-full bg-red-950/50 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse">
                <AlertCircle size={32} />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold tracking-wide bg-gradient-to-r from-red-200 to-red-400 bg-clip-text text-transparent">
                  Session Lock Detected
                </h3>
                <p className="text-[11px] uppercase tracking-wider text-red-400 font-semibold">
                  Conflict Block
                </p>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                Our servers indicate that your account already has an active stream or consultation lock. 
                This usually occurs during unexpected network dropouts, page refreshes, or if another session was left open.
              </p>
            </div>

            <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3.5 text-xs text-red-200/90 leading-relaxed">
              <span className="font-bold block mb-0.5 text-red-300">System Error:</span>
              {conflictError.message}
            </div>

            <div className="flex flex-col gap-2.5 pt-2 relative z-10">
              <button
                type="button"
                onClick={handleResetLock}
                disabled={isResettingLock}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(239,68,68,0.25)] active:scale-[0.98] disabled:opacity-50 text-xs uppercase tracking-wider"
              >
                {isResettingLock ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Resetting locked session...
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Force Release Active Lock
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setConflictError(null)}
                disabled={isResettingLock}
                className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold flex items-center justify-center text-xs transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Stream Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[min(400px,95vw)] rounded-2xl border p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Trash2 className="text-red-500" size={18} /> Cancel Scheduled Stream
            </h3>
            
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to cancel the scheduled stream <strong className="text-gray-900">"{deleteTarget.title}"</strong>? 
              This will remove the stream listing and notify any users who scheduled it.
            </p>

            <div className="flex gap-3 justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="h-9 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={handleDeleteSession}
                disabled={isDeleting}
                className="h-9 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting ? "Canceling..." : "Yes, Cancel Stream"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
