"use client";

import { useEffect, useState } from "react";
import { adminApi } from "../api";

export default function CommissionRates() {
  const [commission, setCommission] = useState({ audio_call: 0, chat: 0, video_call: 0, live_stream: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    adminApi<{ commission?: typeof commission }>("/admin/pricing")
      .then((response) => {
        if (response.data && response.data.commission) {
          setCommission((current) => ({ ...current, ...response.data.commission }));
        }
      })
      .catch(() => undefined);
  }, []);

  const handleRateChange = (key: string, val: string) => {
    const num = parseFloat(val) || 0;
    setCommission((curr) => ({ ...curr, [key]: num }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    adminApi("/admin/pricing/commission", {
      method: "PUT",
      body: JSON.stringify(commission),
    })
      .then(() => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      })
      .catch(() => undefined)
      .finally(() => setIsSaving(false));
  };

  const data = [
    { label: "Audio Call", key: "audio_call", value: commission.audio_call },
    { label: "Chat", key: "chat", value: commission.chat },
    { label: "Video Call", key: "video_call", value: commission.video_call },
    { label: "Live Stream", key: "live_stream", value: commission.live_stream },
  ];

  return (
    <div className="mt-4 rounded-[10px] p-3 bg-white border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-semibold">Commission Rates</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[#4898E1] hover:bg-[#4898E1]/90 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        >
          {isSaving ? "Saving..." : saveSuccess ? "Saved Successfully!" : "Save Rates"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item, i) => (
          <div key={i} className="h-[132px] w-full rounded-[10px] border border-[#4898E1]/30 bg-[#4898E1]/10 p-[15px] flex shadow-sm flex-col justify-between">
            <p className="text-[15px] font-medium">{item.label}</p>
            <div className="flex items-center justify-between">
              <input
                type="number"
                min="0"
                max="100"
                value={item.value}
                onChange={(e) => handleRateChange(item.key, e.target.value)}
                className="text-[20px] sm:text-[24px] w-[130px] rounded-lg border border-[#4898E1]/20 bg-white px-2 py-1 font-medium focus:outline-none focus:border-[#4898E1]"
              />
              <span className="text-[24px] text-[#4898E1] font-medium">%</span>
            </div>
            <p className="text-[14px] font-normal text-gray-500">Platform commission</p>
          </div>
        ))}
      </div>
    </div>
  );
}
