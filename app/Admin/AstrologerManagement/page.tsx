"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import StatsSection from "./StatsSection";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import { adminApi, qs, type ApiMeta } from "../api";
import {
  UserPlus,
  Inbox,
  Eye,
  Check,
  X,
  Sparkles,
  Globe,
  Plus,
  Trash2,
  Shield,
} from "lucide-react";

export type AdminAstrologer = {
  id: string;
  astrologer_code?: string;
  display_name: string;
  approval_status: string;
  expertise?: string[];
  total_sessions?: number;
};

type AstrologerRequest = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_country_code: string;
  phone: string;
  email: string;
  experience_years: number;
  city: string;
  country: string;
  expertise: string[];
  languages: string[];
  short_bio: string;
  status: string;
  created_at: string;
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

export default function Page() {
  const [activeTab, setActiveTab] = useState<"astrologers" | "requests">("astrologers");
  
  // Custom dialog state
  const [customPopup, setCustomPopup] = useState<{
    title: string;
    message: string;
    type: "alert" | "confirm" | "success" | "error";
    onConfirm?: () => void;
  } | null>(null);
  
  // Astrologers state
  const [items, setItems] = useState<AdminAstrologer[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, online: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Join Requests state
  const [requests, setRequests] = useState<AstrologerRequest[]>([]);
  const [reqMeta, setReqMeta] = useState<ApiMeta | null>(null);
  const [reqPage, setReqPage] = useState(1);
  const [reqStatus, setReqStatus] = useState("pending");
  const [reqLoading, setReqLoading] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AstrologerRequest | null>(null);

  // Create Form State
  const [createFullName, setCreateFullName] = useState("");
  const [createDisplayName, setCreateDisplayName] = useState("");
  const [createPrefix, setCreatePrefix] = useState("");
  const [createSuffix, setCreateSuffix] = useState("@astrodhwaj.com");
  const [createPassword, setCreatePassword] = useState("Welcome123!");
  const [createPhone, setCreatePhone] = useState("");
  const [createExp, setCreateExp] = useState(0);
  const [createAudioRate, setCreateAudioRate] = useState(25);
  const [createChatRate, setCreateChatRate] = useState(20);
  const [createVideoRate, setCreateVideoRate] = useState(30);
  const [createAudioCommRate, setCreateAudioCommRate] = useState(20);
  const [createChatCommRate, setCreateChatCommRate] = useState(20);
  const [createVideoCommRate, setCreateVideoCommRate] = useState(20);
  const [createBio, setCreateBio] = useState("");
  const [createExpertise, setCreateExpertise] = useState<string[]>([]);
  const [createOtherExpertise, setCreateOtherExpertise] = useState("");
  const [isCreateOtherChecked, setIsCreateOtherChecked] = useState(false);
  const [createLanguages, setCreateLanguages] = useState<string[]>([]);
  const [createAllowAudio, setCreateAllowAudio] = useState(true);
  const [createAllowChat, setCreateAllowChat] = useState(true);
  const [createAllowVideo, setCreateAllowVideo] = useState(true);
  const [creating, setCreating] = useState(false);

  // Load stats
  const loadStats = () => {
    adminApi<typeof stats>("/admin/astrologers/stats")
      .then((response) => setStats(response.data))
      .catch(() => undefined);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (showCreateModal) {
      adminApi<{ commission?: { audio_call?: number; chat?: number; video_call?: number } }>("/admin/pricing")
        .then((res) => {
          if (res.data && res.data.commission) {
            const comm = res.data.commission;
            if (comm.audio_call !== undefined) setCreateAudioCommRate(comm.audio_call);
            if (comm.chat !== undefined) setCreateChatCommRate(comm.chat);
            if (comm.video_call !== undefined) setCreateVideoCommRate(comm.video_call);
          }
        })
        .catch(() => undefined);
    }
  }, [showCreateModal]);

  // Load active astrologers list
  const loadAstrologers = () => {
    setLoading(true);
    adminApi<AdminAstrologer[]>(`/admin/astrologers${qs({ page, limit: 9, search, status })}`)
      .then((response) => {
        setItems(response.data || []);
        setMeta(response.meta || null);
        setError("");
      })
      .catch((err) => {
        setItems([]);
        setMeta(null);
        setError(err instanceof Error ? err.message : "Unable to load astrologers");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (activeTab === "astrologers") {
      void Promise.resolve().then(loadAstrologers);
    }
  }, [page, search, status, activeTab]);

  // Load candidate requests
  const loadRequests = () => {
    setReqLoading(true);
    adminApi<AstrologerRequest[]>(`/admin/astrologer-requests${qs({ page: reqPage, limit: 9, status: reqStatus })}`)
      .then((response) => {
        setRequests(response.data || []);
        setReqMeta(response.meta || null);
      })
      .catch((err) => {
        setRequests([]);
        setReqMeta(null);
        setCustomPopup({
          title: "Error Loading Requests",
          message: err instanceof Error ? err.message : "Failed to load candidate requests.",
          type: "error",
        });
      })
      .finally(() => setReqLoading(false));
  };

  useEffect(() => {
    if (activeTab === "requests") {
      void Promise.resolve().then(loadRequests);
    }
  }, [reqPage, reqStatus, activeTab]);

  const runAction = (id: string, action: "approve" | "reject") => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, approval_status: action === "approve" ? "approved" : "rejected" } : item));
    adminApi(`/admin/astrologers/${id}/${action}`, { method: "PATCH" })
      .then(() => loadStats())
      .catch(() => {
        setError(`Unable to ${action} astrologer`);
        setPage(1);
      });
  };

  const deleteAstrologer = (id: string) => {
    setCustomPopup({
      title: "Confirm Deletion",
      message: "Are you sure you want to permanently delete this astrologer profile? This cannot be undone.",
      type: "confirm",
      onConfirm: () => {
        adminApi(`/admin/astrologers/${id}`, { method: "DELETE" }).then(() => {
          setItems((current) => current.filter((item) => item.id !== id));
          loadStats();
          setCustomPopup({
            title: "Deleted",
            message: "Astrologer profile deleted successfully.",
            type: "success",
          });
        }).catch(() => {
          setError("Unable to delete astrologer");
        });
      }
    });
  };

  // Submit new astrologer from admin panel
  const handleCreateAstrologerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFullName.trim()) {
      setCustomPopup({
        title: "Validation Error",
        message: "Please enter their full name.",
        type: "error",
      });
      return;
    }
    if (!createPrefix.trim()) {
      setCustomPopup({
        title: "Validation Error",
        message: "Please enter their login email prefix.",
        type: "error",
      });
      return;
    }
    const finalExpertiseCount = createExpertise.length + (isCreateOtherChecked && createOtherExpertise.trim() ? 1 : 0);
    if (finalExpertiseCount === 0) {
      setCustomPopup({
        title: "Validation Error",
        message: "Please select at least one expertise domain.",
        type: "error",
      });
      return;
    }

    setCreating(true);
    adminApi("/admin/astrologers", {
      method: "POST",
      body: JSON.stringify({
        full_name: createFullName,
        display_name: createDisplayName || createFullName,
        email_prefix: createPrefix,
        email_suffix: createSuffix,
        password: createPassword,
        phone: createPhone || undefined,
        experience_years: Number(createExp),
        per_minute_rate: Number(createAudioRate),
        chat_rate: Number(createChatRate),
        video_rate: Number(createVideoRate),
        commission_rate: Number(createChatCommRate),
        audio_commission_rate: Number(createAudioCommRate),
        chat_commission_rate: Number(createChatCommRate),
        video_commission_rate: Number(createVideoCommRate),
        services_allowed: [
          createAllowChat && "chat",
          createAllowAudio && "audio_call",
          createAllowVideo && "video_call",
        ].filter(Boolean),
        expertise: [
          ...createExpertise,
          ...(isCreateOtherChecked && createOtherExpertise.trim()
            ? createOtherExpertise.split(",").map((x) => x.trim()).filter(Boolean)
            : []),
        ],
        languages: createLanguages,
        bio: createBio,
      }),
    })
      .then(() => {
        setCustomPopup({
          title: "Account Created",
          message: "Astrologer account created and credentials registered successfully!",
          type: "success",
        });
        setShowCreateModal(false);
        // Reset states
        setCreateFullName("");
        setCreateDisplayName("");
        setCreatePrefix("");
        setCreateSuffix("@astrodhwaj.com");
        setCreatePassword("Welcome123!");
        setCreatePhone("");
        setCreateExp(0);
        setCreateExpertise([]);
        setCreateOtherExpertise("");
        setIsCreateOtherChecked(false);
        setCreateLanguages([]);
        setCreateBio("");
        setCreateAudioCommRate(20);
        setCreateChatCommRate(20);
        setCreateVideoCommRate(20);
        setCreateAllowAudio(true);
        setCreateAllowChat(true);
        setCreateAllowVideo(true);
        loadStats();
        if (activeTab === "astrologers") {
          loadAstrologers();
        }
      })
      .catch((err) => {
        setCustomPopup({
          title: "Registration Failed",
          message: err instanceof Error ? err.message : "Failed to create astrologer.",
          type: "error",
        });
      })
      .finally(() => setCreating(false));
  };

  // Approve joining candidate request
  const handleApproveRequest = (reqId: string) => {
    setCustomPopup({
      title: "Confirm Approval",
      message: "Are you sure you want to approve this candidate application?\n\nThis will automatically create a secure User and Astrologer account with a default password of 'Welcome123!' and notify them.",
      type: "confirm",
      onConfirm: () => {
        adminApi(`/admin/astrologer-requests/${reqId}/approve`, { method: "POST" })
          .then(() => {
            setCustomPopup({
              title: "Approved",
              message: "Candidate application approved successfully! Account is active.",
              type: "success",
            });
            setSelectedRequest(null);
            loadRequests();
            loadStats();
          })
          .catch((err) => {
            setCustomPopup({
              title: "Approval Failed",
              message: err instanceof Error ? err.message : "Failed to approve candidate.",
              type: "error",
            });
          });
      }
    });
  };

  // Reject joining candidate request
  const handleRejectRequest = (reqId: string) => {
    setCustomPopup({
      title: "Confirm Rejection",
      message: "Are you sure you want to reject this candidate application?",
      type: "confirm",
      onConfirm: () => {
        adminApi(`/admin/astrologer-requests/${reqId}/reject`, { method: "POST" })
          .then(() => {
            setCustomPopup({
              title: "Rejected",
              message: "Candidate application rejected.",
              type: "success",
            });
            setSelectedRequest(null);
            loadRequests();
          })
          .catch((err) => {
            setCustomPopup({
              title: "Rejection Failed",
              message: err instanceof Error ? err.message : "Failed to reject candidate.",
              type: "error",
            });
          });
      }
    });
  };

  return (
    <>
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-slate-50 p-2 py-8 pl-5 pr-2 md:p-8 font-[DM_Sans]">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
              Astrologer Center
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Manage consulting rates, languages, credentials prefix/suffix domains, and onboarding requests.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setActiveTab(activeTab === "astrologers" ? "requests" : "astrologers");
                setPage(1);
                setReqPage(1);
              }}
              className={`inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all border ${
                activeTab === "requests"
                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Inbox className="h-4.5 w-4.5" />
              {activeTab === "requests" ? "View Astrologers" : "View Requests"}
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4898E1] hover:bg-[#4898E1]/90 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4.5 w-4.5" />
              Create Astrologer
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Dynamic List Section */}
        {activeTab === "astrologers" ? (
          <>
            <div className="mt-6 flex flex-col lg:flex-row bg-white p-4 border border-slate-100 shadow-sm rounded-xl gap-3 md:flex-row md:items-center md:justify-between">
              <SearchBar value={search} onChange={(value) => { setPage(1); setSearch(value); }} />
              <FilterTabs value={status} onChange={(value) => { setPage(1); setStatus(value); }} />
            </div>

            {loading && <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-xl border border-slate-100 mt-6">Loading active astrologers list...</div>}
            {!loading && error && <div className="p-12 text-center text-red-500 bg-white rounded-xl border border-slate-100 mt-6">{error}</div>}
            {!loading && !error && items.length === 0 && (
              <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-100 mt-6">
                No active astrologers found matching search criteria.
              </div>
            )}
            
            {!loading && !error && items.length > 0 && (
              <div className="mt-6">
                <UserTable data={items} onAction={runAction} onDelete={deleteAstrologer} />
                <Pagination page={page} totalPages={meta?.total_pages || 1} onPageChange={setPage} />
              </div>
            )}
          </>
        ) : (
          <>
            {/* Join Requests Filter Bar */}
            <div className="mt-6 flex items-center justify-between bg-white p-4 border border-slate-100 shadow-sm rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter By Status:</span>
                {["pending", "approved", "rejected", "all"].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => {
                      setReqPage(1);
                      setReqStatus(statusOption);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all select-none border ${
                      reqStatus === statusOption
                        ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>

            {reqLoading && <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-xl border border-slate-100 mt-6">Loading onboarding candidate requests...</div>}
            {!reqLoading && requests.length === 0 && (
              <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-100 mt-6">
                No onboard requests found in this category.
              </div>
            )}

            {!reqLoading && requests.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-100">
                  <table className="min-w-[1100px] w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-4 font-bold text-slate-700 whitespace-nowrap">Candidate Name</th>
                        <th className="p-4 font-bold text-slate-700 whitespace-nowrap">Gender</th>
                        <th className="p-4 font-bold text-slate-700 whitespace-nowrap">Email ID</th>
                        <th className="p-4 font-bold text-slate-700 whitespace-nowrap">Phone</th>
                        <th className="p-4 font-bold text-slate-700 whitespace-nowrap">Location (City, Country)</th>
                        <th className="p-4 font-bold text-slate-700 whitespace-nowrap">Experience</th>
                        <th className="p-4 font-bold text-slate-700 text-center whitespace-nowrap">Status</th>
                        <th className="p-4 font-bold text-slate-700 text-center whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                            {req.first_name} {req.last_name}
                          </td>
                          <td className="p-4 whitespace-nowrap">{req.gender}</td>
                          <td className="p-4 font-medium whitespace-nowrap">{req.email}</td>
                          <td className="p-4 whitespace-nowrap">
                            {req.phone_country_code} {req.phone}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {req.city}, {req.country}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full text-xs">
                              {req.experience_years} Yrs
                            </span>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                              req.status === "approved"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : req.status === "rejected"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse"
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 relative">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedRequest(req)}
                                className="p-1.5 rounded-lg border bg-white text-[#4898E1] hover:bg-blue-50 transition-colors shadow-sm"
                                title="View candidate request profile"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {req.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleApproveRequest(req.id)}
                                    className="p-1.5 rounded-lg border bg-white text-emerald-500 hover:bg-emerald-50 transition-colors shadow-sm"
                                    title="Approve onboarding"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectRequest(req.id)}
                                    className="p-1.5 rounded-lg border bg-white text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                    title="Reject onboarding"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={reqPage} totalPages={reqMeta?.total_pages || 1} onPageChange={setReqPage} />
              </div>
            )}
          </>
        )}

      </div>

      {/* CREATE ASTROLOGER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[800px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4.5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#4898E1]" />
                Register New Astrologer
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="h-8 w-8 rounded-full bg-slate-50 border text-slate-400 hover:text-slate-800 flex items-center justify-center font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateAstrologerSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-700">
              
              {/* Profile Details */}
              <div className="bg-slate-50/50 p-4 border rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Identity</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Full Name (seekers visible)</label>
                    <input
                      type="text"
                      required
                      value={createFullName}
                      onChange={(e) => setCreateFullName(e.target.value)}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white outline-none focus:border-[#4898E1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Display Name (seekers search)</label>
                    <input
                      type="text"
                      value={createDisplayName}
                      onChange={(e) => setCreateDisplayName(e.target.value)}
                      placeholder="e.g. Astro Rohan"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white outline-none focus:border-[#4898E1]"
                    />
                  </div>
                </div>
              </div>

              {/* Login Credentials (Prefix/Suffix Domain) */}
              <div className="bg-slate-50/50 p-4 border rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Login Authentication Credentials</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Unique Email Address</label>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
                      <input
                        type="text"
                        required
                        value={createPrefix}
                        onChange={(e) => setCreatePrefix(e.target.value.replace(/\s+/g, ""))}
                        placeholder="prefix (e.g. rohan)"
                        className="flex-1 px-3 py-2 text-sm outline-none border-none text-right"
                      />
                      <input
                        type="text"
                        required
                        value={createSuffix}
                        onChange={(e) => setCreateSuffix(e.target.value.replace(/\s+/g, ""))}
                        placeholder="suffix (e.g. @astrodhwaj.com)"
                        className="w-48 px-3 py-2 text-sm bg-slate-50 border-l border-slate-200 outline-none text-slate-600 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Login Password</label>
                    <input
                      type="text"
                      required
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="password"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white outline-none focus:border-[#4898E1] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* pricing Rates */}
              <div className="bg-slate-50/50 p-4 border rounded-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">pricing configurations</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Audio call (₹/min)</label>
                    <input
                      type="number"
                      required
                      value={createAudioRate}
                      onChange={(e) => setCreateAudioRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white outline-none focus:border-[#4898E1]"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">chat session (₹/min)</label>
                    <input
                      type="number"
                      required
                      value={createChatRate}
                      onChange={(e) => setCreateChatRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white outline-none focus:border-[#4898E1]"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">video call (₹/min)</label>
                    <input
                      type="number"
                      required
                      value={createVideoRate}
                      onChange={(e) => setCreateVideoRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white outline-none focus:border-[#4898E1]"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Audio Comm (%)</label>
                    <input
                      type="number"
                      required
                      value={createAudioCommRate}
                      onChange={(e) => setCreateAudioCommRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white outline-none focus:border-[#4898E1]"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Chat Comm (%)</label>
                    <input
                      type="number"
                      required
                      value={createChatCommRate}
                      onChange={(e) => setCreateChatCommRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white outline-none focus:border-[#4898E1]"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Video Comm (%)</label>
                    <input
                      type="number"
                      required
                      value={createVideoCommRate}
                      onChange={(e) => setCreateVideoCommRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm bg-white outline-none focus:border-[#4898E1]"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Allowed consultation services
                  </label>
                  <div className="flex flex-wrap gap-5 mt-1">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createAllowChat}
                        onChange={(e) => setCreateAllowChat(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#4898E1] focus:ring-[#4898E1] cursor-pointer"
                      />
                      Chat Session
                    </label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createAllowAudio}
                        onChange={(e) => setCreateAllowAudio(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#4898E1] focus:ring-[#4898E1] cursor-pointer"
                      />
                      Audio Call
                    </label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createAllowVideo}
                        onChange={(e) => setCreateAllowVideo(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#4898E1] focus:ring-[#4898E1] cursor-pointer"
                      />
                      Video Call
                    </label>
                  </div>
                </div>
              </div>

              {/* Extra Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4898E1]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={createExp}
                    onChange={(e) => setCreateExp(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4898E1]"
                    min="0"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold mb-1">Short Biography Details</label>
                <textarea
                  value={createBio}
                  onChange={(e) => setCreateBio(e.target.value)}
                  placeholder="Lineage, expertise, accomplishments..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4898E1] min-h-[60px]"
                />
              </div>

              {/* Expertise Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Expertise & Systems Known</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border p-3 rounded-xl max-h-[160px] overflow-y-auto bg-slate-50/50">
                  {EXPERTISE_OPTIONS.map((item) => {
                    const active = createExpertise.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => {
                          if (active) {
                            setCreateExpertise(createExpertise.filter((x) => x !== item));
                          } else {
                            setCreateExpertise([...createExpertise, item]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between ${
                          active
                            ? "bg-amber-50 border-amber-200 text-amber-800"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <span>{item}</span>
                        <span className={`h-3.5 w-3.5 rounded border text-[9px] flex items-center justify-center ${active ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"}`}>
                          {active ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}

                  {/* OTHER OPTION */}
                  <div className="col-span-2 sm:col-span-3 flex flex-col sm:flex-row gap-2 mt-1.5 items-stretch">
                    <button
                      type="button"
                      onClick={() => setIsCreateOtherChecked(!isCreateOtherChecked)}
                      className={`px-3 py-1.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between min-w-[120px] ${
                        isCreateOtherChecked
                          ? "bg-amber-50 border-amber-200 text-amber-800"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      <span>Other (Custom)</span>
                      <span className={`h-3.5 w-3.5 rounded border text-[9px] flex items-center justify-center ${isCreateOtherChecked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"}`}>
                        {isCreateOtherChecked ? "✓" : ""}
                      </span>
                    </button>
                    {isCreateOtherChecked && (
                      <input
                        type="text"
                        value={createOtherExpertise}
                        onChange={(e) => setCreateOtherExpertise(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-250 px-3 py-1 text-xs text-slate-800 bg-white outline-none focus:border-amber-500"
                        placeholder="Type other systems (comma-separated)..."
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Language Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Consulting Languages</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border p-3 rounded-xl max-h-[140px] overflow-y-auto bg-slate-50/50">
                  {LANGUAGE_OPTIONS.map((item) => {
                    const active = createLanguages.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => {
                          if (active) {
                            setCreateLanguages(createLanguages.filter((x) => x !== item));
                          } else {
                            setCreateLanguages([...createLanguages, item]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between ${
                          active
                            ? "bg-blue-50 border-blue-200 text-blue-800"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <span>{item}</span>
                        <span className={`h-3.5 w-3.5 rounded border text-[9px] flex items-center justify-center ${active ? "bg-blue-500 border-blue-500 text-white" : "border-slate-300"}`}>
                          {active ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </form>

            {/* Footer */}
            <div className="bg-white border-t px-6 py-4 flex items-center justify-end gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 rounded-lg border text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAstrologerSubmit}
                disabled={creating}
                className="px-6 py-2.5 rounded-lg bg-[#4898E1] hover:bg-[#4898E1]/90 text-white font-semibold transition-all text-sm shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Create Astrologer"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REQUEST VIEW eye DETAIL MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[650px] bg-slate-950 text-white rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#161720] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Candidate Registration Profile
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="h-8 w-8 rounded-full bg-white/5 border border-white/15 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 leading-relaxed text-sm text-slate-300">
              
              {/* Profile Identity */}
              <div className="border border-white/10 rounded-xl p-4 space-y-2 bg-white/5">
                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate Name</span>
                  <span className="text-sm font-bold text-white">
                    {selectedRequest.first_name} {selectedRequest.last_name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div><span className="text-slate-400">Gender:</span> <span className="font-semibold text-white">{selectedRequest.gender}</span></div>
                  <div><span className="text-slate-400">Experience:</span> <span className="font-bold text-amber-400">{selectedRequest.experience_years} Years</span></div>
                  <div className="col-span-2 truncate"><span className="text-slate-400">Email ID:</span> <span className="font-semibold text-white font-mono">{selectedRequest.email}</span></div>
                  <div><span className="text-slate-400">Phone:</span> <span className="font-semibold text-white">{selectedRequest.phone_country_code} {selectedRequest.phone}</span></div>
                  <div><span className="text-slate-400">City, Country:</span> <span className="font-semibold text-white">{selectedRequest.city}, {selectedRequest.country}</span></div>
                </div>
              </div>

              {/* Bio */}
              <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Biography</span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-xs italic bg-black/20 p-3 rounded-lg border border-white/5">
                  &quot;{selectedRequest.short_bio || "No biography details supplied."}&quot;
                </p>
              </div>

              {/* Expertise Systems Known */}
              <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Systems Known (Expertise)
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.expertise.map((item) => (
                    <span key={item} className="bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-blue-400" />
                  Fluent Consulting Languages
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.languages.map((item) => (
                    <span key={item} className="bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="bg-[#161720] border-t border-white/10 px-6 py-4 flex items-center justify-between sticky bottom-0 z-10">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Status: <span className="text-white">{selectedRequest.status}</span>
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300"
                >
                  Close
                </button>
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                      className="px-4 py-2 rounded-xl bg-red-650 hover:bg-red-750 text-white text-xs font-bold flex items-center gap-1 bg-red-600 shadow-md"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject Request
                    </button>
                    <button
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-650 hover:bg-emerald-750 text-white text-xs font-bold flex items-center gap-1 bg-emerald-600 shadow-md"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve & Seed Account
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Custom Popup Modal for Alert/Confirm */}
      {customPopup && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] bg-slate-900 text-white rounded-2xl border border-white/10 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-full ${
                customPopup.type === "success" 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : customPopup.type === "error"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}>
                {customPopup.type === "success" && <Check className="h-6 w-6" />}
                {customPopup.type === "error" && <X className="h-6 w-6" />}
                {(customPopup.type === "confirm" || customPopup.type === "alert") && <Shield className="h-6 w-6" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1.5">{customPopup.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{customPopup.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              {customPopup.type === "confirm" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setCustomPopup(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const onConf = customPopup.onConfirm;
                      setCustomPopup(null);
                      if (onConf) onConf();
                    }}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomPopup(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
