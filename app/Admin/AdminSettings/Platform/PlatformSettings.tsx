"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ExportButton from "../../CommonComponents/ExportButton";
import { adminApi } from "../../api";

type PlatformValues = {
  platform_name: string;
  platform_url: string;
  description: string;
  support_email: string;
  support_phone: string;
  logo_url: string;
  language: string;
  timezone: string;
  currency: string;
};

export default function PlatformSettings() {
  const [values, setValues] = useState<PlatformValues>({
    platform_name: "AstroDhwaj",
    platform_url: "https://astrodhwaj.com",
    description: "Professional astrology consultation platform connecting users with verified astrologers.",
    support_email: "support@astrodhwaj.com",
    support_phone: "+1 (800) 123-4567",
    logo_url: "/logo/logo.jpeg",
    language: "English",
    timezone: "IST (UTC +5:30)",
    currency: "INR (₹)",
  });
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    adminApi<{ values?: Partial<PlatformValues> }>("/admin/settings/platform")
      .then((response) => setValues((current) => ({ ...current, ...(response.data.values || {}) })))
      .catch(() => undefined);
  }, []);

  const save = () => {
    adminApi("/admin/settings/platform", { method: "PUT", body: JSON.stringify({ values }) })
      .then(() => setMessage("Saved"))
      .catch((err) => setMessage(err instanceof Error ? err.message : "Save failed"));
  };

  const uploadLogo = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const response = await adminApi<{ url: string }>("/upload/image", { method: "POST", body: form });
    setValues((current) => ({ ...current, logo_url: response.data.url }));
  };

  return (
    <div className="space-y-6">
      <div className=" shadow-sm rounded-xl p-6">
        <h2 className="text-[20px] font-semibold mb-4">Platform Information</h2>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Platform Name" value={values.platform_name} onChange={(value) => setValues((current) => ({ ...current, platform_name: value }))} />
          <Input label="Platform URL" value={values.platform_url} onChange={(value) => setValues((current) => ({ ...current, platform_url: value }))} />
        </div>

        <div className="mb-4">
          <label className="text-[16px] text-gray-600">Platform Description</label>
          <textarea
            className="w-full mt-1 border rounded-[8px] p-3 text-[14px]"
            rows={3}
            value={values.description}
            onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
          />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Support Email" value={values.support_email} onChange={(value) => setValues((current) => ({ ...current, support_email: value }))} />
          <Input label="Support Phone" value={values.support_phone} onChange={(value) => setValues((current) => ({ ...current, support_phone: value }))} />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-orange-200">
            <Image src={values.logo_url || "/logo/logo.jpeg"} height={60} width={60} alt="AstroDhwaj logo" />
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadLogo(file).catch((err) => setMessage(err instanceof Error ? err.message : "Upload failed"));
            event.currentTarget.value = "";
          }} />
          <button onClick={() => fileRef.current?.click()} className="border px-4 py-2 rounded-[8px] border-dotted bg-gray-200 text-[14px]">
            Upload New Logo
          </button>
        </div>
      </div>

      <div className="rounded-xl p-6">
        <h2 className="text-[20px] font-semibold mb-4">Regional Settings</h2>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Select label="Default Language" value={values.language} options={["English"]} onChange={(value) => setValues((current) => ({ ...current, language: value }))} />
          <Select label="Time Zone" value={values.timezone} options={["IST (UTC +5:30)"]} onChange={(value) => setValues((current) => ({ ...current, timezone: value }))} />
          <Select label="Currency" value={values.currency} options={["INR (₹)"]} onChange={(value) => setValues((current) => ({ ...current, currency: value }))} />
        </div>

        <div className="flex justify-end">
          <ExportButton name="Save Platform Settings" type="save" onClick={save} />
        </div>
        {message && <p className="mt-3 text-right text-sm text-gray-500">{message}</p>}
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
};

type SelectProps = {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
};

function Input({ label, value, onChange }: InputProps) {
  return (
    <div>
      <label className="text-[14px] shadow-sm text-gray-600">{label}</label>
      <input value={value} onChange={(event) => onChange?.(event.target.value)} className="w-full mt-1 border rounded-[8px] p-3 text-[14px]" />
    </div>
  );
}

function Select({ label, options, value, onChange }: SelectProps) {
  return (
    <div>
      <label className="text-[14px] text-gray-600">{label}</label>
      <select value={value} onChange={(event) => onChange?.(event.target.value)} className="w-full mt-1 border rounded-[8px] p-3 text-[14px]">
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
