"use client";
import ServicePricingSection from "./ServicePricingSection";
import {
  User,
  Star,
  IndianRupee,
  BarChart3,
  Phone,
  MessageSquare,
  Video,
} from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function PerformanceDashboardModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40">
      {/* CENTER WRAPPER */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* MODAL BOX */}
        <div className="w-full max-w-[1100px] max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 font-[DM_Sans] shadow-lg">
          {/* HEADER */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white pb-4">
            <h1 className="text-[28px] font-semibold">Performance Dashboard</h1>
            <button onClick={onClose} className="text-xl font-bold">
              ✕
            </button>
          </div>

          {/* PROFILE */}
          <div className="mt-4 flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
              <User />
            </div>

            <div>
              <p className="text-lg font-semibold">Dr. Priya Sharma</p>

              <p className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-500" />
                4.8 (2840 Consultations)
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <User />, value: "842", label: "Total Sessions" },
              {
                icon: <IndianRupee />,
                value: "₹425K",
                label: "Total Earnings",
              },
              { icon: <Star />, value: "18", label: "Years Experience" },
              { icon: <BarChart3 />, value: "20%", label: "Commissions" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-purple-300 bg-purple-50 p-4"
              >
                <div className="mb-2 text-purple-600">{item.icon}</div>

                <p className="text-[22px] font-semibold">{item.value}</p>

                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>

          {/* SERVICE PRICING */}
          <div className="mt-6 rounded-xl border p-4">
            <h2 className="mb-4 text-lg font-semibold">Service Pricing</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: <Phone />, price: "₹25/Min", label: "Audio Call" },
                { icon: <MessageSquare />, price: "₹18/Min", label: "Chat" },
                { icon: <Video />, price: "₹30/Min", label: "Video Call" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center rounded-xl border p-4 text-center"
                >
                  <div className="mb-2 text-purple-600">{item.icon}</div>

                  <p className="font-semibold">{item.price}</p>

                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PRICING RANGE */}
          <div className="mt-6 rounded-xl border p-4">
            <h2 className="mb-4 text-lg font-semibold">
              Service Pricing Ranges
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                "For Audio Call",
                "For Video Call",
                "For Chat",
                "For Live Stream",
              ].map((label, i) => (
                <div key={i}>
                  <p className="mb-1 text-sm">{label}</p>

                  <input
                    type="number"
                    defaultValue={50}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ABOUT */}
          <div className="mt-6 rounded-xl border p-4">
            <h2 className="mb-2 text-lg font-semibold">About</h2>

            <p className="text-sm text-gray-600">
              Renowned palmist and Vastu expert with 18 years of experience.
              Known for accurate palm readings and powerful remedies for life
              challenges.
            </p>
          </div>

          {/* EXPERTISE + LANGUAGES */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* EXPERTISE */}
            <div className="rounded-xl border p-4">
              <h2 className="mb-3 font-semibold">Expertise</h2>

              <div className="flex flex-wrap gap-2">
                {["Vedic Astrology", "Tarot Reading", "Numerology"].map(
                  (item, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-yellow-100 px-3 py-1 text-sm"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* LANGUAGES */}
            <div className="rounded-xl border p-4">
              <h2 className="mb-3 font-semibold">Languages</h2>

              <div className="flex flex-wrap gap-2">
                {["Hindi", "English", "Gujarati"].map((item, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-purple-100 px-3 py-1 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 mt-6 flex justify-center gap-4 border-t bg-white pt-4">
            <button className="rounded-md bg-purple-700 px-6 py-2 text-white">
              Update Changes
            </button>

            <button onClick={onClose} className="rounded-md border px-6 py-2">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
