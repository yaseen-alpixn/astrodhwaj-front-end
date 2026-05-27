"use client";

import { useEffect, useState } from "react";
import { adminApi, formatCurrency } from "../../api";
import {
  User,
  Star,
  IndianRupee,
  BarChart3,
  Phone,
  MessageSquare,
  Video,
  Globe,
  Settings,
  Sparkles,
  BookOpen,
  Shield,
} from "lucide-react";

type Props = {
  id: string;
  onClose: () => void;
};

type AstrologerDetail = {
  display_name?: string;
  email?: string;
  phone?: string;
  per_minute_rate?: number;
  chat_rate?: number;
  video_rate?: number;
  commission_rate?: number;
  audio_commission_rate?: number;
  chat_commission_rate?: number;
  video_commission_rate?: number;
  services_allowed?: string[];
  experience_years?: number;
  bio?: string;
  expertise?: string[];
  languages?: string[];
  rating?: number;
  total_sessions?: number;
  total_earnings?: number;
};

const EXPERTISE_OPTIONS = [
  "Vedic", "Vedic Astrology", "KP System", "Lal Kitab", "Vastu", "Tarot Reading", "Nadi", 
  "Numerology", "Ashtakvarga", "Palmistry", "Ramal", "Jaimini", "Tajik", 
  "Western", "Kerala", "Swar Shastra", "Reiki Healing", "Crystal Healing", 
  "Angel Reading", "Feng Shui", "Prashna / Horary", "Pendulum Dowsing", 
  "Psychic Reading", "Face Reading", "Muhurta", "Kundali", "Love", "Career",
  "Chakra", "Relationship"
];

const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu", "Kannada", "Marathi", 
  "Gujarati", "Punjabi", "Malayalam", "Odia", "Sanskrit", "Urdu", "Assamese"
];

export default function PerformanceDashboardModal({ id, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [astro, setAstro] = useState<AstrologerDetail | null>(null);

  // Editable Form fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [perMinuteRate, setPerMinuteRate] = useState(25);
  const [chatRate, setChatRate] = useState(20);
  const [videoRate, setVideoRate] = useState(30);
  const [commissionRate, setCommissionRate] = useState(20);
  const [audioCommissionRate, setAudioCommissionRate] = useState(20);
  const [chatCommissionRate, setChatCommissionRate] = useState(20);
  const [videoCommissionRate, setVideoCommissionRate] = useState(20);
  const [experienceYears, setExperienceYears] = useState(0);
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [otherExpertise, setOtherExpertise] = useState("");
  const [isOtherChecked, setIsOtherChecked] = useState(false);

  const [allowAudio, setAllowAudio] = useState(true);
  const [allowChat, setAllowChat] = useState(true);
  const [allowVideo, setAllowVideo] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Custom Popup Alert and Confirmation States
  const [customToast, setCustomToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmEmailPopup, setConfirmEmailPopup] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      adminApi<AstrologerDetail>(`/admin/astrologers/${id}`)
        .then((response) => {
          const data = response.data;
          setAstro(data);
          setDisplayName(data.display_name || "");
          setEmail(data.email || "");
          setOriginalEmail(data.email || "");
          setPhone(data.phone || "");
          setPerMinuteRate(data.per_minute_rate || 25);
          setChatRate(data.chat_rate || 20);
          setVideoRate(data.video_rate || 30);
          setCommissionRate(data.commission_rate || 20);
          setAudioCommissionRate(data.audio_commission_rate !== undefined ? data.audio_commission_rate : (data.commission_rate || 20));
          setChatCommissionRate(data.chat_commission_rate !== undefined ? data.chat_commission_rate : (data.commission_rate || 20));
          setVideoCommissionRate(data.video_commission_rate !== undefined ? data.video_commission_rate : (data.commission_rate || 20));
          const allowed = data.services_allowed || ["chat", "audio_call", "video_call"];
          setAllowAudio(allowed.includes("audio_call"));
          setAllowChat(allowed.includes("chat"));
          setAllowVideo(allowed.includes("video_call"));
          setExperienceYears(data.experience_years || 0);
          setBio(data.bio || "");
          
          const loadedExpertise = data.expertise || [];
          const standardSelected = loadedExpertise.filter((x: string) => EXPERTISE_OPTIONS.includes(x));
          const customSelected = loadedExpertise.filter((x: string) => !EXPERTISE_OPTIONS.includes(x));
          setExpertise(standardSelected);
          if (customSelected.length > 0) {
            setIsOtherChecked(true);
            setOtherExpertise(customSelected.join(", "));
          } else {
            setIsOtherChecked(false);
            setOtherExpertise("");
          }

          setLanguages(data.languages || []);
          setError("");
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load astrologer details.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const executeUpdate = () => {
    setUpdating(true);
    setCustomToast(null);
    adminApi(`/admin/astrologers/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        display_name: displayName,
        email: email.trim(),
        phone: phone.trim(),
        per_minute_rate: Number(perMinuteRate),
        chat_rate: Number(chatRate),
        video_rate: Number(videoRate),
        commission_rate: Number(chatCommissionRate),
        audio_commission_rate: Number(audioCommissionRate),
        chat_commission_rate: Number(chatCommissionRate),
        video_commission_rate: Number(videoCommissionRate),
        services_allowed: [
          allowChat && "chat",
          allowAudio && "audio_call",
          allowVideo && "video_call",
        ].filter(Boolean),
        experience_years: Number(experienceYears),
        bio: bio,
        expertise: [
          ...expertise,
          ...(isOtherChecked && otherExpertise.trim()
            ? otherExpertise.split(",").map((x) => x.trim()).filter(Boolean)
            : []),
        ],
        languages: languages,
      }),
    })
      .then(() => {
        setOriginalEmail(email);
        setCustomToast({
          message: "Astrologer details updated successfully in database!",
          type: "success",
        });
        // Auto dismiss toast after 4 seconds
        setTimeout(() => setCustomToast(null), 4000);
      })
      .catch((err) => {
        setCustomToast({
          message: err instanceof Error ? err.message : "Failed to update details.",
          type: "error",
        });
      })
      .finally(() => setUpdating(false));
  };

  const handleUpdate = () => {
    // Check if email has been changed
    if (email.trim().toLowerCase() !== originalEmail.trim().toLowerCase()) {
      setConfirmEmailPopup(true);
    } else {
      executeUpdate();
    }
  };

  const handleToggleExpertise = (item: string) => {
    if (expertise.includes(item)) {
      setExpertise(expertise.filter((x) => x !== item));
    } else {
      setExpertise([...expertise, item]);
    }
  };

  const handleToggleLanguage = (item: string) => {
    if (languages.includes(item)) {
      setLanguages(languages.filter((x) => x !== item));
    } else {
      setLanguages([...languages, item]);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 border-4 border-[#4898E1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-700">Loading astrologer profile...</p>
          <p className="text-xs text-slate-400 mt-2">Connecting to secure database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-[450px] rounded-2xl bg-white p-6 text-center shadow-2xl">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">✕</div>
          <p className="text-lg font-semibold text-slate-800 mb-2">Error Encountered</p>
          <p className="text-sm text-red-500 mb-6 bg-red-50 py-2.5 px-4 rounded-lg border border-red-100">{error}</p>
          <button onClick={onClose} className="w-full py-2.5 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors">
            Close Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
      {/* CENTER WRAPPER */}
      <div className="flex min-h-full items-center justify-center p-4 md:p-6">
        {/* MODAL BOX */}
        <div className="w-full max-w-[1100px] rounded-2xl bg-[#FCFCFD] overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
          
          {/* HEADER */}
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2.5">
                <Sparkles className="h-5.5 w-5.5 text-[#4898E1]" />
                Performance Dashboard
              </h1>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-slate-50 border hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold transition-all">
              ✕
            </button>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Custom Toast Alert/Popup Banner */}
            {customToast && (
              <div className={`p-4 rounded-xl border flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-4 duration-200 ${
                customToast.type === "success" 
                  ? "bg-emerald-50 border-emerald-250 text-emerald-800" 
                  : "bg-red-50 border-red-250 text-red-800"
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    customToast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                  }`}>
                    {customToast.type === "success" ? "✓" : "✕"}
                  </span>
                  <p className="text-sm font-bold">{customToast.message}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setCustomToast(null)} 
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline ml-4 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            {/* PROFILE & DETAILS EDITOR */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row gap-5 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4898E1] to-[#7f2cff] text-white text-3xl font-extrabold shadow-md flex-shrink-0">
                {displayName ? displayName.charAt(0).toUpperCase() : <User />}
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#4898E1] focus:ring-2 focus:ring-[#4898E1]/12 outline-none font-medium"
                      placeholder="e.g. Radhika Sen"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Login Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#4898E1] focus:ring-2 focus:ring-[#4898E1]/12 outline-none font-medium"
                      placeholder="e.g. radhika@astrodhwaj.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Contact Phone No
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#4898E1] focus:ring-2 focus:ring-[#4898E1]/12 outline-none font-medium"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-slate-800 font-bold">{Number(astro?.rating || 0).toFixed(1)}</span>
                  <span>({astro?.total_sessions || 0} Consultations logged)</span>
                </div>
              </div>
            </div>

            {/* PERFORMANCE METRICS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <User className="h-5 w-5" />,
                  value: String(astro?.total_sessions || 0),
                  label: "Total Sessions",
                  bg: "from-blue-50 to-indigo-50 border-blue-100 text-blue-600",
                },
                {
                  icon: <IndianRupee className="h-5 w-5" />,
                  value: formatCurrency(astro?.total_earnings || 0),
                  label: "Total Earnings",
                  bg: "from-emerald-50 to-teal-50 border-emerald-100 text-emerald-600",
                },
                {
                  icon: <BookOpen className="h-5 w-5" />,
                  value: `${experienceYears} Years`,
                  label: "Consulting Experience",
                  bg: "from-amber-50 to-orange-50 border-amber-100 text-amber-600",
                },
                {
                  icon: <BarChart3 className="h-5 w-5" />,
                  value: `${chatCommissionRate}%`,
                  label: "Platform Comm. Rate",
                  bg: "from-purple-50 to-fuchsia-50 border-purple-100 text-purple-600",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-xl border bg-gradient-to-br ${item.bg} p-4.5 shadow-sm transition-all hover:shadow-md`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.label}</span>
                    <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100">{item.icon}</div>
                  </div>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {/* SERVICE PRICING CARD */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Settings className="h-4.5 w-4.5 text-[#4898E1]" />
                Service Configurations & Rates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                
                {/* AUDIO RATE */}
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-500 border border-blue-100">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Audio Call</p>
                      <p className="text-lg font-extrabold text-slate-700">₹{perMinuteRate}/min</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Audio Rate (₹/Min)</label>
                    <input
                      type="number"
                      value={perMinuteRate}
                      onChange={(e) => setPerMinuteRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white font-medium"
                      min="0"
                    />
                  </div>
                </div>

                {/* CHAT RATE */}
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#7f2cff]/10 text-[#7f2cff] border border-[#7f2cff]/20">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Chat Session</p>
                      <p className="text-lg font-extrabold text-slate-700">₹{chatRate}/min</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Chat Rate (₹/Min)</label>
                    <input
                      type="number"
                      value={chatRate}
                      onChange={(e) => setChatRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white font-medium"
                      min="0"
                    />
                  </div>
                </div>

                {/* VIDEO RATE */}
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 border border-indigo-100">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Video Call</p>
                      <p className="text-lg font-extrabold text-slate-700">₹{videoRate}/min</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Video Rate (₹/Min)</label>
                    <input
                      type="number"
                      value={videoRate}
                      onChange={(e) => setVideoRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white font-medium"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200/60 pt-4">
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Supported Consultation Modes</label>
                  <div className="flex flex-wrap gap-5 mt-1">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowChat}
                        onChange={(e) => setAllowChat(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#4898E1] focus:ring-[#4898E1] cursor-pointer"
                      />
                      Chat
                    </label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowAudio}
                        onChange={(e) => setAllowAudio(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#4898E1] focus:ring-[#4898E1] cursor-pointer"
                      />
                      Audio Call
                    </label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowVideo}
                        onChange={(e) => setAllowVideo(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#4898E1] focus:ring-[#4898E1] cursor-pointer"
                      />
                      Video Call
                    </label>
                  </div>
                </div>

                {/* PLATFORM PARAMETERS */}
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Audio Comm (%)</label>
                    <input
                      type="number"
                      value={audioCommissionRate}
                      onChange={(e) => setAudioCommissionRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white font-medium"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Chat Comm (%)</label>
                    <input
                      type="number"
                      value={chatCommissionRate}
                      onChange={(e) => setChatCommissionRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white font-medium"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Video Comm (%)</label>
                    <input
                      type="number"
                      value={videoCommissionRate}
                      onChange={(e) => setVideoCommissionRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white font-medium"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white font-medium"
                      min="0"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* BIO */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-3">About/Biography</h2>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 min-h-[90px] focus:border-[#4898E1] focus:ring-2 focus:ring-[#4898E1]/12 outline-none leading-relaxed"
                placeholder="Provide details about the astrologer's education, heritage, lineage, and accomplishments..."
              />
            </div>

            {/* EXPERTISE CHECKLIST */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                Expertise & Vedic Systems Known
              </h2>
              <p className="text-xs text-slate-400 mb-4 font-medium">Select all consulting domains that this astrologer excels in.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {EXPERTISE_OPTIONS.map((item) => {
                  const active = expertise.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleToggleExpertise(item)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl text-left border flex items-center justify-between transition-all select-none ${
                        active
                          ? "bg-amber-50 border-amber-200 text-amber-800 shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{item}</span>
                      <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${active ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300 bg-white"}`}>
                        {active ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
                
                {/* OTHER OPTION */}
                <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6 flex flex-col sm:flex-row gap-2.5 items-stretch mt-2">
                  <button
                    type="button"
                    onClick={() => setIsOtherChecked(!isOtherChecked)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl text-left border flex items-center justify-between transition-all select-none min-w-[130px] ${
                      isOtherChecked
                        ? "bg-amber-50 border-amber-200 text-amber-800 shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Other (Custom)</span>
                    <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${isOtherChecked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300 bg-white"}`}>
                      {isOtherChecked ? "✓" : ""}
                    </span>
                  </button>
                  {isOtherChecked && (
                    <input
                      type="text"
                      value={otherExpertise}
                      onChange={(e) => setOtherExpertise(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none font-semibold bg-white"
                      placeholder="Specify other systems (comma-separated)..."
                    />
                  )}
                </div>
              </div>
            </div>

            {/* LANGUAGES CHECKLIST */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-indigo-500" />
                Spoken Languages
              </h2>
              <p className="text-xs text-slate-400 mb-4 font-medium">Select languages the astrologer can fluently consult in.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {LANGUAGE_OPTIONS.map((item) => {
                  const active = languages.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleToggleLanguage(item)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl text-left border flex items-center justify-between transition-all select-none ${
                        active
                          ? "bg-indigo-50 border-indigo-200 text-indigo-800 shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{item}</span>
                      <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${active ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-300 bg-white"}`}>
                        {active ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="bg-white border-t px-6 py-4 flex items-center justify-end gap-3 sticky bottom-0 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="px-6 py-2.5 rounded-lg bg-[#4898E1] hover:bg-[#4898E1]/90 text-white font-semibold transition-all text-sm shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Changes"
              )}
            </button>
          </div>

        </div>
      </div>
      {/* Custom Confirmation Popup for Email update */}
      {confirmEmailPopup && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] bg-slate-900 text-white rounded-2xl border border-white/10 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Confirm Email Login Change
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to change the astrologer&apos;s login email to: 
              <strong className="text-white block mt-1 font-mono text-sm">{email}</strong>
              <span className="block mt-2 text-amber-400 font-semibold">This will update their login credentials and they must log in using this new email.</span>
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmEmailPopup(false)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 cursor-pointer"
              >
                No, Keep Original
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmEmailPopup(false);
                  executeUpdate();
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Yes, Update Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
