"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking, getAstrologerDetail, type Astrologer } from "@/services/user.service";
import { Star, Phone, MessageSquare, Video, ShieldCheck, Award, MessageCircle } from "lucide-react";

type Props = {
  id: string;
  onClose: () => void;
};

type Review = {
  id?: string;
  _id?: string;
  rating?: number;
  comment?: string;
  created_at?: string;
};

type AstrologerDetails = Astrologer & {
  reviews?: Review[];
  experience_years?: number;
};

export default function SeekerAstrologerProfileModal({ id, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMode, setBookingMode] = useState<"audio_call" | "chat" | "video_call" | null>(null);
  const [astro, setAstro] = useState<AstrologerDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      getAstrologerDetail(id)
        .then((response) => {
          const detail = response.data as AstrologerDetails;
          setAstro(detail);
          setReviews(detail.reviews || []);
          setError("");
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load astrologer details.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] rounded-[24px] bg-white p-8 text-center font-[DM_Sans] shadow-2xl">
          <div className="w-12 h-12 border-4 border-[#4898E1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Fetching profile details...</p>
        </div>
      </div>
    );
  }

  if (error || !astro) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] rounded-[24px] bg-white p-8 text-center font-[DM_Sans] shadow-2xl">
          <p className="text-lg text-red-500 font-semibold mb-4">{error || "Astrologer not found"}</p>
          <button onClick={onClose} className="bg-[#4898E1] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#4898E1]/90">
            Close
          </button>
        </div>
      </div>
    );
  }

  const audioRate = astro.per_minute_rate || 0;
  const chatRate = Math.round(audioRate * 0.8);
  const videoRate = Math.round(audioRate * 1.2);

  const startConsultation = (mode: "audio_call" | "chat" | "video_call") => {
    setBookingMode(mode);
    setError("");
    createBooking({ astrologer_id: astro.id, consultation_mode: mode, duration: 30 })
      .then((response) => {
        onClose();
        const bookingId = response.data.id;
        if (mode === "chat") {
          router.push(`/User/message?bookingId=${bookingId}`);
        } else if (mode === "video_call") {
          router.push(`/VideoCall?bookingId=${bookingId}`);
        } else {
          router.push(`/AudioCall?bookingId=${bookingId}`);
        }
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Unable to start consultation";
        setError(message);
        if (message.toLowerCase().includes("insufficient") || message.toLowerCase().includes("wallet")) {
          router.push("/User/wallet");
        }
      })
      .finally(() => setBookingMode(null));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-[DM_Sans]">
      <div className="w-full max-w-[700px] max-h-[85vh] overflow-y-auto rounded-[28px] bg-white p-6 md:p-8 shadow-2xl relative">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center font-bold text-gray-600"
        >
          ✕
        </button>

        {/* HERO HEADER */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
          {astro.avatar_url ? (
            <img
              src={astro.avatar_url}
              alt={astro.display_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#E8F4FF]"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#0180D5] to-[#4898E1] text-white flex items-center justify-center text-4xl font-extrabold shadow-md">
              {astro.display_name ? astro.display_name.charAt(0).toUpperCase() : "A"}
            </div>
          )}

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{astro.display_name}</h1>
              <ShieldCheck className="h-5 w-5 text-blue-500" />
            </div>

            <p className="text-gray-500 text-sm mt-1">{(astro.expertise || []).join(" • ")}</p>
            
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
              <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-700">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {Number(astro.rating || 0).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {astro.experience_years || 0} Years Exp
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <div className="text-xs text-green-600 font-semibold capitalize">
                {astro.status || "online"}
              </div>
            </div>
          </div>
        </div>

        {/* SERVICE RATES BOX */}
        <div className="mt-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Consultation Rates</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Phone className="h-4 w-4" />, rate: `₹${audioRate}/min`, label: "Audio Call", bg: "bg-[#E8F4FF] text-[#0180D5]", key: "audio_call" },
              { icon: <MessageSquare className="h-4 w-4" />, rate: `₹${chatRate}/min`, label: "Chat Session", bg: "bg-pink-50 text-pink-700", key: "chat" },
              { icon: <Video className="h-4 w-4" />, rate: `₹${videoRate}/min`, label: "Video Call", bg: "bg-orange-50 text-orange-700", key: "video_call" },
            ]
            .filter((item) => astro.services_allowed === undefined || astro.services_allowed.includes(item.key))
            .map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-gray-50 hover:bg-white hover:border-blue-200 transition-all text-center">
                <div className={`p-2 rounded-full mb-1.5 ${item.bg}`}>
                  {item.icon}
                </div>
                <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                <span className="text-sm font-bold text-gray-800 mt-0.5">{item.rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT BIO */}
        <div className="mt-6">
          <h2 className="text-base font-bold text-gray-800 mb-2">About Astrologer</h2>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {astro.bio || `Highly experienced consultant specializing in Vedic Astrology remedies, helping clients navigate life's challenges with actionable advice and spiritual guidance.`}
          </p>
        </div>

        {/* OTHER DETAILS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-2xl p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-[#4898E1]" />
              Core Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(astro.expertise || []).map((exp, i) => (
                <span key={i} className="bg-blue-50 text-[#0180D5] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          <div className="border rounded-2xl p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-green-500" />
              Languages Spoken
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(astro.languages || []).map((lang, i) => (
                <span key={i} className="bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT REVIEWS SECTION */}
        <div className="mt-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">User Feedback & Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id || rev._id} className="border-b last:border-none pb-3 pt-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-700">{rev.rating}.0</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString("en-IN") : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 italic">&quot;{rev.comment || "Excellent guidance, very satisfied."}&quot;</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border rounded-2xl bg-gray-50/50">
              <p className="text-xs text-gray-400 italic">No feedback reviews submitted yet. Average rating: {Number(astro.rating || 0).toFixed(1)} ★</p>
            </div>
          )}
        </div>

        {/* CALL TO ACTION ACTIONS */}
        <div className="mt-8 flex gap-3">
          {(astro.services_allowed === undefined || astro.services_allowed.includes("audio_call")) && (
            <button 
              onClick={() => startConsultation("audio_call")}
              disabled={bookingMode !== null}
              className="flex-1 flex items-center justify-center gap-2 bg-[#4898E1] hover:bg-[#4898E1]/90 text-white font-semibold py-3 rounded-2xl transition shadow-md shadow-blue-100"
            >
              <Phone className="h-4 w-4" />
              {bookingMode === "audio_call" ? "Starting..." : `Audio Call (₹${audioRate}/min)`}
            </button>
          )}
          
          {(astro.services_allowed === undefined || astro.services_allowed.includes("chat")) && (
            <button 
              onClick={() => startConsultation("chat")}
              disabled={bookingMode !== null}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-[#4898E1] hover:bg-[#E8F4FF] text-[#0180D5] font-semibold py-3 rounded-2xl transition"
            >
              <MessageSquare className="h-4 w-4" />
              {bookingMode === "chat" ? "Starting..." : `Chat (₹${chatRate}/min)`}
            </button>
          )}

          {(astro.services_allowed === undefined || astro.services_allowed.includes("video_call")) && (
            <button 
              onClick={() => startConsultation("video_call")}
              disabled={bookingMode !== null}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-2xl transition"
            >
              <Video className="h-4 w-4" />
              {bookingMode === "video_call" ? "Starting..." : `Video Call (₹${videoRate}/min)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
