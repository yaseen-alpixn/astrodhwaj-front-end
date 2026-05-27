"use client";

import { useCallback, useEffect, useState } from "react";
import Tabs from "./Tabs";
import QueueCard from "./QueueCard";
import SessionCard from "./SessionCard";
import { getBookings, acceptBooking, declineBooking, endBooking } from "@/services/astrologer.service";

type ConsultationBooking = {
  id: string;
  consultation_mode: string;
  booking_time?: string;
  duration?: number;
  status: string;
  metadata?: {
    user_name?: string;
  };
};

export default function Consultation() {
  const [active, setActive] = useState("Queue (3)");
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const fetchBookings = useCallback((tab: string) => {
    setLoading(true);
    setActionError("");
    let status = "pending";
    if (tab === "Scheduled") status = "confirmed";
    else if (tab === "Completed") status = "completed";
    else if (tab === "Waiting") status = "waiting";

    getBookings({ status })
      .then((res) => {
        setBookings(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load bookings", err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => fetchBookings(active), 0);
    return () => window.clearTimeout(timer);
  }, [active, fetchBookings]);

  const handleAccept = async (id: string) => {
    try {
      await acceptBooking(id);
      fetchBookings(active);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to accept booking.");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineBooking(id);
      fetchBookings(active);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to decline booking.");
    }
  };

  const handleEnd = async (id: string) => {
    try {
      await endBooking(id);
      fetchBookings(active);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to end booking.");
    }
  };

  return (
    <div className="mx-auto w-full space-y-6 p-4 md:p-6 w-full text-black">
      <Tabs active={active} setActive={setActive} />
      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4898E1] border-t-transparent mx-auto"></div>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-10">No consultations found.</p>
      ) : (
        <div className="space-y-4 w-full">
          {bookings.map((booking) => {
            const isQueue = active.startsWith("Queue");
            const modeMap: Record<string, string> = {
              "chat": "Chat",
              "audio_call": "Audio Call",
              "video_call": "Video Call"
            };
            const modeLabel = modeMap[booking.consultation_mode] || booking.consultation_mode;

            if (isQueue) {
              return (
                <QueueCard
                  key={booking.id}
                  id={booking.id}
                  name={booking.metadata?.user_name || "Client"}
                  type={modeLabel}
                  onAccept={() => handleAccept(booking.id)}
                  onDecline={() => handleDecline(booking.id)}
                />
              );
            } else {
              return (
                <SessionCard
                  key={booking.id}
                  id={booking.id}
                  name={booking.metadata?.user_name || "Client"}
                  time={booking.booking_time || "N/A"}
                  duration={booking.duration || 0}
                  status={booking.status}
                  type={modeLabel}
                  onEnd={booking.status === "confirmed" ? () => handleEnd(booking.id) : undefined}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
