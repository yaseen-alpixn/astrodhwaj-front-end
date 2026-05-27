"use client";

import { useEffect, useState } from "react";
import { adminApi } from "../../api";

export default function EmailSMSSettings() {
  const [values, setValues] = useState({
    smtp_host: "smtp.gmail.com",
    smtp_port: "587",
    smtp_username: "noreply@astrodhwaj.com",
    smtp_password: "************",
    from_email: "no-reply@astrodhwaj.com",
    sms_provider: "twilio",
    sms_api_key: "",
    sms_sender_id: "ASTCNT",
    twilio_account_sid: "",
    twilio_auth_token: "",
    twilio_from_number: "",
    sms_test_to: "",
    test_email: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminApi<{ values?: Partial<typeof values> }>("/admin/settings/email-sms")
      .then((response) => setValues((current) => ({ ...current, ...(response.data.values || {}) })))
      .catch(() => undefined);
  }, []);

  const setField = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const save = () => {
    adminApi("/admin/settings/email-sms", { method: "PUT", body: JSON.stringify({ values }) })
      .then(() => setMessage("Saved"))
      .catch((err) => setMessage(err instanceof Error ? err.message : "Save failed"));
  };
  const testEmail = () => {
    adminApi("/admin/settings/email-sms/test-email", { method: "POST", body: JSON.stringify({ to_email: values.test_email || null, values }) })
      .then(() => setMessage("Test email sent"))
      .catch((err) => setMessage(err instanceof Error ? err.message : "Email test failed"));
  };
  const testSms = () => {
    adminApi("/admin/settings/email-sms/test-sms", { method: "POST", body: JSON.stringify({ to_phone: values.sms_test_to || null, values }) })
      .then(() => setMessage("Test SMS sent"))
      .catch((err) => setMessage(err instanceof Error ? err.message : "SMS test failed"));
  };

  return (
    <div className="space-y-6">
      {/* SMTP CONFIG */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-[20px] font-semibold mb-4">SMTP Configuration</h2>

        {/* Row 1 */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="SMTP Host"
            value={values.smtp_host}
            placeholder="Enter SMTP host"
            onChange={(value) => setField("smtp_host", value)}
          />
          <Input label="SMTP Port" value={values.smtp_port} placeholder="Enter SMTP port" onChange={(value) => setField("smtp_port", value)} />
        </div>

        {/* Row 2 */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="SMTP Username"
            value={values.smtp_username}
            placeholder="Enter username"
            onChange={(value) => setField("smtp_username", value)}
          />
          <PasswordInput label="SMTP Password" value={values.smtp_password} onChange={(value) => setField("smtp_password", value)} />
        </div>

        {/* Row 3 */}
        <div className="mb-4">
          <Input
            label="From Email Address"
            value={values.from_email}
            placeholder="Enter from email"
            onChange={(value) => setField("from_email", value)}
          />
        </div>

        <div className="mb-4">
          <Input
            label="Test Email Address"
            value={values.test_email}
            placeholder="Enter email for test"
            onChange={(value) => setField("test_email", value)}
          />
        </div>

        {/* Button */}
        <button onClick={testEmail} className="border border-[#4898E1]/30 text-[#4898E1] hover:bg-[#4898E1]/5 px-4 py-2 rounded-[8px] text-[14px] transition-colors">
          Test Email Configuration
        </button>
      </div>

      {/* SMS CONFIG */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-[20px] font-semibold mb-4">
          SMS Gateway Configuration
        </h2>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Select
            label="SMS Provider"
            options={["Twilio", "Vonage", "AWS SNS", "Plivo"]}
            value={values.sms_provider}
            onChange={(value) => setField("sms_provider", value)}
          />
          <Input label="API Key" value={values.sms_api_key} placeholder="Enter your SMS API key" onChange={(value) => setField("sms_api_key", value)} />
          <Input
            label="Sender ID"
            value={values.sms_sender_id}
            placeholder="Enter sender ID"
            onChange={(value) => setField("sms_sender_id", value)}
          />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Twilio Account SID"
            value={values.twilio_account_sid}
            placeholder="Enter Twilio account SID"
            onChange={(value) => setField("twilio_account_sid", value)}
          />
          <PasswordInput
            label="Twilio Auth Token"
            value={values.twilio_auth_token}
            placeholder="Enter Twilio auth token"
            onChange={(value) => setField("twilio_auth_token", value)}
          />
          <Input
            label="Twilio From Number"
            value={values.twilio_from_number}
            placeholder="+1234567890"
            onChange={(value) => setField("twilio_from_number", value)}
          />
          <Input
            label="Test Phone Number"
            value={values.sms_test_to}
            placeholder="+911234567890"
            onChange={(value) => setField("sms_test_to", value)}
          />
        </div>

        <button onClick={testSms} className="border border-[#4898E1]/30 text-[#4898E1] hover:bg-[#4898E1]/5 px-4 py-2 rounded-[8px] text-[14px] transition-colors">
          Test SMS Configuration
        </button>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button onClick={save} className="bg-[#4898E1] hover:bg-[#4898E1]/90 text-white px-6 py-2 rounded-[8px] transition-colors">
          Save Email & SMS Settings
        </button>
      </div>
      {message && <p className="text-right text-sm text-gray-500">{message}</p>}

      {/* FOOTER */}
    </div>
  );
}

// Types
type InputProps = {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
};

type PasswordInputProps = {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

type SelectProps = {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
};

// INPUT Component - Fixed with proper optional props
function Input({ label, value, placeholder, type = "text", onChange }: InputProps) {
  return (
    <div className="w-full">
      <label className="text-[14px] text-gray-600 font-medium block mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-[8px] p-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4898E1] focus:border-transparent transition-all"
      />
    </div>
  );
}

// PASSWORD INPUT Component - Fixed with proper icon placeholder
function PasswordInput({
  label,
  value,
  placeholder = "Enter password",
  onChange,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full">
      <label className="text-[14px] text-gray-600 font-medium block mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value || ""}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-[8px] p-3 text-[14px] pr-10 focus:outline-none focus:ring-2 focus:ring-[#4898E1] focus:border-transparent transition-all"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => setVisible((current) => !current)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// SELECT Component - Fixed with proper styling
function Select({ label, options, value, onChange }: SelectProps) {
  return (
    <div className="w-full">
      <label className="text-[14px] text-gray-600 font-medium block mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full border border-gray-300 rounded-[8px] p-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4898E1] focus:border-transparent transition-all bg-white"
      >
        <option value="">Select provider</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
