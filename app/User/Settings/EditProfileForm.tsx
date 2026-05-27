"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Calendar, MapPin, Clock, User, Phone, Lock, Eye, EyeOff, Save, Search, Camera } from "lucide-react";
import { getProfile as getUserProfile, updateProfile as updateUserProfile, uploadAvatar as userUploadAvatar } from "@/services/user.service";
import { getProfile as getAstroProfile, updateProfile as updateAstroProfile, uploadAvatar as astroUploadAvatar, type AstrologerProfileUpdate } from "@/services/astrologer.service";
import { usePathname } from "next/navigation";
import Avatar from "@/app/components/common/Avatar";

type EditProfileFormProps = {
  onBack: () => void;
};

type LocationSearchResult = {
  name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
};

type UserProfileData = {
  full_name?: string;
  phone?: string;
  avatar_url?: string | null;
  date_of_birth?: string;
  place_of_birth?: string;
  time_of_birth?: string;
};

type AstrologerEditProfileData = {
  display_name?: string;
  user?: {
    full_name?: string;
    phone?: string;
    avatar_url?: string | null;
  };
};

type UserProfileUpdatePayload = {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  time_of_birth?: string;
  password?: string;
};

export default function EditProfileForm({ onBack }: EditProfileFormProps) {
  const pathname = usePathname();
  const isAstrologer = pathname.startsWith("/Astrologer");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Geolocation API State
  const [locationSearch, setLocationSearch] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  // Fetch active profile on component load
  useEffect(() => {
    if (isAstrologer) {
      getAstroProfile()
        .then((response) => {
          const u = response.data as AstrologerEditProfileData;
          setFullName(u.user?.full_name || u.display_name || "");
          setPhone(u.user?.phone || "");
          setAvatarUrl(u.user?.avatar_url || null);
          setDateOfBirth("");
          setPlaceOfBirth("");
          setTimeOfBirth("");
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load profile details.");
        })
        .finally(() => {
          setFetching(false);
        });
      return;
    }

    getUserProfile()
      .then((response) => {
          const u = response.data as UserProfileData;
          setFullName(u.full_name || "");
          setPhone(u.phone || "");
          setDateOfBirth(u.date_of_birth || "");
          setPlaceOfBirth(u.place_of_birth || "");
          setTimeOfBirth(u.time_of_birth || "");
          setAvatarUrl(u.avatar_url || null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile details.");
      })
      .finally(() => {
        setFetching(false);
      });
  }, [isAstrologer]);

  // Fetch location autocompletes from Nominatim Geolocation API
  useEffect(() => {
    if (locationSearch.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchingLocation(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationSearch
          )}&limit=5&addressdetails=1`
        );
        if (res.ok) {
          const data = (await res.json()) as LocationSearchResult[];
          const list = data.map((item) => {
            const address = item.address || {};
            const city = address.city || address.town || address.village || item.name || "";
            const state = address.state || "";
            const country = address.country || "";
            return [city, state, country].filter(Boolean).join(", ");
          });
          // Remove duplicates
          setSearchResults(Array.from(new Set<string>(list)));
        }
      } catch (err) {
        console.error("Nominatim fetch error:", err);
      } finally {
        setSearchingLocation(false);
      }
    }, 600); // 600ms debounce rate

    return () => clearTimeout(delayDebounce);
  }, [locationSearch]);

  // Click outside listener for suggestions box
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Dynamic Avatar Uploads via Cloudinary API
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Submit file to Cloudinary upload service
      const uploader = isAstrologer ? astroUploadAvatar : userUploadAvatar;
      const updater = isAstrologer ? updateAstroProfile : updateUserProfile;
      const uploadResponse = await uploader(file);
      const secureUrl = uploadResponse.data.url;

      // 2. Perform immediate profile avatar_url update
      await updater({ avatar_url: secureUrl });
      
      setAvatarUrl(secureUrl);
      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // reset input
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isAstrologer) {
        const payload: AstrologerProfileUpdate = {
          full_name: fullName,
          phone: phone || undefined,
          display_name: fullName,
          password: password.trim() || undefined,
        };
        await updateAstroProfile(payload);
      } else {
        const payload: UserProfileUpdatePayload = {
          full_name: fullName,
          phone: phone || undefined,
          date_of_birth: dateOfBirth || undefined,
          place_of_birth: placeOfBirth || undefined,
          time_of_birth: timeOfBirth || undefined,
          password: password.trim() || undefined,
        };
        await updateUserProfile(payload);
      }
      setSuccess("Profile details updated successfully!");
      setPassword(""); // Clear password field
      
      // Auto-back to list after showing success briefly
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <div className="text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#0085FF] border-t-transparent mx-auto"></div>
          <p className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 shadow-[0_22px_54px_rgba(72,152,225,0.08)] sm:p-6 lg:p-8">
      {/* Header View */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-black"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <div>
          <h2 className="text-[22px] font-extrabold tracking-tight text-[#17151d]">
            Edit Profile Details
          </h2>
          <p className="text-[12px] font-medium text-gray-400">
            Keep your astrology details accurate for precise charts
          </p>
        </div>
      </div>

      {/* Interactive Profile Photo Editor Section */}
      <div className="flex flex-col items-center mb-6 pb-5 border-b border-gray-100">
        <div className="relative group">
          <div className="relative overflow-hidden rounded-full">
            <Avatar src={avatarUrl} name={fullName} size={90} />
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-[#0085FF] text-white hover:bg-[#0070d6] active:scale-90 transition rounded-full shadow-md"
            title="Upload Profile Picture"
          >
            <Camera size={15} />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2.5 text-xs font-bold text-[#0085FF] hover:underline"
        >
          {uploading ? "Uploading Image..." : "Upload Profile Picture"}
        </button>
      </div>

      {/* Status Notifications */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-600 shadow-sm leading-relaxed">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3.5 text-xs font-semibold text-green-600 shadow-sm">
          {success}
        </div>
      )}

      {/* Main Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-medium text-[#16151b] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#0085FF]/8"
              placeholder="Enter full name"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-medium text-[#16151b] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#0085FF]/8"
              placeholder="Enter phone number"
            />
          </div>

          {/* Date of Birth */}
          {!isAstrologer && (
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-medium text-[#16151b] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#0085FF]/8"
              />
            </div>
          )}

          {/* Time of Birth */}
          {!isAstrologer && (
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                Time of Birth
              </label>
              <input
                type="time"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-medium text-[#16151b] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#0085FF]/8"
              />
            </div>
          )}
        </div>

        {/* Place of Birth */}
        {!isAstrologer && (
          <div className="space-y-2 border-t border-dashed border-gray-100 pt-4">
            <label className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              Place of Birth
            </label>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* API Geolocation Lookup */}
              <div className="relative space-y-1" ref={suggestionsRef}>
                <div className="relative">
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-[#f9fafb] pl-10 pr-4 text-[13px] font-medium text-gray-700 outline-none transition focus:border-[#0085FF] focus:bg-white focus:ring-4 focus:ring-[#0085FF]/8"
                    placeholder="API City search (e.g. Delhi, Mumbai)"
                  />
                  <Search size={14} className="absolute left-3.5 top-3.5 text-gray-400 animate-pulse" />
                  {searchingLocation && (
                    <div className="absolute right-3.5 top-3.5 h-4 w-4 animate-spin rounded-full border-2 border-[#0085FF] border-t-transparent"></div>
                  )}
                </div>

                {/* Suggestions Overlay Dropdown */}
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
                    {searchResults.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setPlaceOfBirth(loc);
                          setLocationSearch("");
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Manual Birthplace Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-[14px] font-medium text-[#16151b] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#0085FF]/8"
                  placeholder="Or type birthplace manually"
                />
              </div>
            </div>
          </div>
        )}

        {/* Change Password (Optional) */}
        <div className="space-y-1.5 border-t border-gray-100 pt-4">
          <label className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
            <Lock size={14} className="text-gray-400" />
            Update Password (Leave blank to keep current)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-4 pr-12 text-[14px] font-medium text-[#16151b] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#0085FF]/8"
              placeholder="Enter new password (min. 8 characters)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-gray-500 hover:text-black transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3.5 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-[14px] font-bold text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#0085FF_0%,#7013b7_100%)] px-6 py-2.5 text-[14px] font-bold text-white shadow-md transition hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {loading ? "Saving Details..." : "Save Changes"}
          </button>
        </div>

      </form>
    </section>
  );
}
