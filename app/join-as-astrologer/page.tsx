"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Globe, Shield, ArrowLeft } from "lucide-react";

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

export default function JoinAsAstrologerPage() {
  const router = useRouter();

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Selected arrays
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [otherExpertise, setOtherExpertise] = useState("");
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // UI Modal popups
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Error/Success state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleToggleExpertise = (item: string) => {
    if (selectedExpertise.includes(item)) {
      setSelectedExpertise(selectedExpertise.filter((x) => x !== item));
    } else {
      setSelectedExpertise([...selectedExpertise, item]);
    }
  };

  const handleToggleLanguage = (item: string) => {
    if (selectedLanguages.includes(item)) {
      setSelectedLanguages(selectedLanguages.filter((x) => x !== item));
    } else {
      setSelectedLanguages([...selectedLanguages, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full first name and last name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!city.trim() || !country.trim()) {
      setError("Please enter your city and country.");
      return;
    }
    const finalExpertiseCount = selectedExpertise.length + (isOtherChecked && otherExpertise.trim() ? 1 : 0);
    if (finalExpertiseCount === 0) {
      setError("Please select at least one System Known (Expertise).");
      return;
    }
    if (selectedLanguages.length === 0) {
      setError("Please select at least one language.");
      return;
    }
    if (!agreed) {
      setError("You must agree to our Terms of Use to proceed.");
      return;
    }

    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${apiBase}/auth/astrologer-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          gender: gender,
          phone_country_code: phoneCountryCode,
          phone: phone,
          email: email,
          experience_years: Number(experienceYears || 0),
          city: city,
          country: country,
          expertise: [
            ...selectedExpertise,
            ...(isOtherChecked && otherExpertise.trim()
              ? otherExpertise.split(",").map((x) => x.trim()).filter(Boolean)
              : []),
          ],
          languages: selectedLanguages,
          short_bio: shortBio,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to submit request. Please check your fields.");
      }

      setSuccess("Your join request has been submitted successfully! The admin team will review your application and email you with credentials.");
      
      // Reset form
      setFirstName("");
      setLastName("");
      setGender("Male");
      setPhone("");
      setEmail("");
      setExperienceYears("");
      setCity("");
      setCountry("");
      setSelectedExpertise([]);
      setOtherExpertise("");
      setIsOtherChecked(false);
      setSelectedLanguages([]);
      setShortBio("");
      setAgreed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-[DM_Sans]"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(3, 9, 38, 0.92) 0%, rgba(27, 18, 66, 0.9) 55%, rgba(78, 22, 102, 0.8) 100%), url('/images/login-bg.svg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(84,103,255,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(215,56,255,0.18),transparent_35%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[650px]">
        {/* Back Link */}
        <Link
          href="/login/astrologer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white mb-6 transition-all bg-white/5 py-1.5 px-3 rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Astrologer Login
        </Link>

        {/* Card */}
        <div className="rounded-[26px] bg-[linear-gradient(180deg,rgba(72,78,118,0.9)_0%,rgba(46,52,90,0.9)_100%)] p-2.5 shadow-[0_30px_100px_rgba(7,12,40,0.45)] ring-1 ring-white/12">
          <div className="rounded-[18px] bg-[#111218] text-white px-5 py-7 sm:px-8 sm:py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            
            {/* LOGO & HEADER */}
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-[linear-gradient(135deg,#f5c84b_0%,#7f2cff_100%)] p-[3px] shadow-[0_10px_24px_rgba(122,30,177,0.35)]">
                <Image
                  src="/logo/logo.jpeg"
                  alt="AstroDhwaj logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                  unoptimized
                />
              </div>
              <h1 className="mt-3.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Join Astro Dhwaj
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-medium max-w-[400px]">
                Submit your professional astrologer profile. Our admin team will verify your credentials and approve your application.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-5 rounded-xl bg-red-950/50 border border-red-500/30 p-3.5 text-xs font-semibold text-red-400 shadow-sm leading-relaxed">
                ✕ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 p-4 text-xs font-semibold text-emerald-400 shadow-sm leading-relaxed">
                ✓ {success}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              
              {/* NAMES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* GENDER & PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#161720] px-3.5 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Country Code</label>
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#161720] px-3.5 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  >
                    <option value="+91">India (+91)</option>
                    <option value="+1">USA (+1)</option>
                    <option value="+44">UK (+44)</option>
                    <option value="+971">UAE (+971)</option>
                    <option value="+61">Australia (+61)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* EMAIL & EXPERIENCE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Email ID</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 5"
                    min="0"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* CITY & COUNTRY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter country"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10"
                  />
                </div>
              </div>

              {/* SYSTEM KNOWN (EXPERTISE CHIPS SELECTOR) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">System Known (Expertise)</label>
                <button
                  type="button"
                  onClick={() => setShowExpertiseModal(true)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-left text-slate-300 outline-none flex items-center justify-between hover:bg-white/8 transition-all"
                >
                  <span className="truncate">
                    {selectedExpertise.length > 0
                      ? selectedExpertise.join(", ")
                      : "Select Vedic systems known..."}
                  </span>
                  <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0 ml-2" />
                </button>
              </div>

              {/* LANGUAGES SELECTION CHIPS */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Select Language(s)</label>
                <button
                  type="button"
                  onClick={() => setShowLanguageModal(true)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-left text-slate-300 outline-none flex items-center justify-between hover:bg-white/8 transition-all"
                >
                  <span className="truncate">
                    {selectedLanguages.length > 0
                      ? selectedLanguages.join(", ")
                      : "Select consulting languages..."}
                  </span>
                  <Globe className="h-4 w-4 text-blue-400 flex-shrink-0 ml-2" />
                </button>
              </div>

              {/* BIO */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Short Bio</label>
                <textarea
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  placeholder="Tell seeker and seekers about yourself, lineage, education..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-500 focus:bg-white/10 min-h-[70px] leading-relaxed"
                />
              </div>

              {/* TERMS AGREEMENT */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agreed-terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4.5 w-4.5 rounded border-white/20 bg-white/5 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="agreed-terms" className="text-[11px] leading-relaxed text-slate-400 font-medium cursor-pointer select-none">
                  By using this app, you are agreeing to our{" "}
                  <Link href="/about" className="text-amber-500 hover:underline">
                    Terms of Use
                  </Link>{" "}
                  and candidate verification procedures.
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-[#7013b7] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting Application...
                  </>
                ) : (
                  "Send Request"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* EXPERTISE CHECKLIST MODAL */}
      {showExpertiseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-[500px] rounded-2xl bg-[#161720] border border-white/10 p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              System Known Selection
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-semibold">Select all Vedic practices that you fluently consult in.</p>
            
            <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 py-1">
              {EXPERTISE_OPTIONS.map((item) => {
                const active = selectedExpertise.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleToggleExpertise(item)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all select-none ${
                      active
                        ? "bg-amber-500/10 border-amber-500 text-amber-400"
                        : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/8"
                    }`}
                  >
                    <span>{item}</span>
                    <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${active ? "bg-amber-500 border-amber-500 text-white" : "border-slate-500 bg-transparent"}`}>
                      {active ? "✓" : ""}
                    </span>
                  </button>
                );
              })}

              {/* OTHER OPTION */}
              <div className="col-span-2 flex flex-col gap-2 mt-1.5 items-stretch">
                <button
                  type="button"
                  onClick={() => setIsOtherChecked(!isOtherChecked)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all select-none ${
                    isOtherChecked
                      ? "bg-amber-500/10 border-amber-500 text-amber-400"
                      : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/8"
                  }`}
                >
                  <span>Other (Custom Practice)</span>
                  <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${isOtherChecked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-500 bg-transparent"}`}>
                    {isOtherChecked ? "✓" : ""}
                  </span>
                </button>
                {isOtherChecked && (
                  <input
                    type="text"
                    value={otherExpertise}
                    onChange={(e) => setOtherExpertise(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 h-11 text-xs text-white outline-none focus:border-amber-500"
                    placeholder="Specify other systems (comma-separated)..."
                  />
                )}
              </div>
            </div>
            
            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setSelectedExpertise([])}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowExpertiseModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md"
              >
                Confirm OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LANGUAGES CHECKLIST MODAL */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-[500px] rounded-2xl bg-[#161720] border border-white/10 p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Language Selection
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-semibold">Select all consulting languages that you can speak.</p>
            
            <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 py-1">
              {LANGUAGE_OPTIONS.map((item) => {
                const active = selectedLanguages.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleToggleLanguage(item)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all select-none ${
                      active
                        ? "bg-blue-500/10 border-blue-500 text-blue-400"
                        : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/8"
                    }`}
                  >
                    <span>{item}</span>
                    <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${active ? "bg-blue-500 border-blue-500 text-white" : "border-slate-500 bg-transparent"}`}>
                      {active ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setSelectedLanguages([])}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-md"
              >
                Confirm OK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
