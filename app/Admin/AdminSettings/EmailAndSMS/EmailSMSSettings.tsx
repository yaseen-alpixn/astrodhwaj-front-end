"use client";

export default function EmailSMSSettings() {
  return (
    <div className="space-y-6">
      {/* SMTP CONFIG */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-[20px] font-semibold mb-4">SMTP Configuration</h2>

        {/* Row 1 */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="SMTP Host"
            value="smtp.gmail.com"
            placeholder="Enter SMTP host"
          />
          <Input label="SMTP Port" value="587" placeholder="Enter SMTP port" />
        </div>

        {/* Row 2 */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="SMTP Username"
            value="noreply@astroconnect.com"
            placeholder="Enter username"
          />
          <PasswordInput label="SMTP Password" value="************" />
        </div>

        {/* Row 3 */}
        <div className="mb-4">
          <Input
            label="From Email Address"
            value="no-reply@astroconnect.com"
            placeholder="Enter from email"
          />
        </div>

        {/* Button */}
        <button className="border border-purple-500 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-[8px] text-[14px] transition-colors">
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
          />
          <Input label="API Key" placeholder="Enter your SMS API key" />
          <Input
            label="Sender ID"
            value="ASTCNT"
            placeholder="Enter sender ID"
          />
        </div>

        <button className="border border-purple-500 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-[8px] text-[14px] transition-colors">
          Test SMS Configuration
        </button>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-[8px] transition-colors">
          Save Email & SMS Settings
        </button>
      </div>

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
};

type PasswordInputProps = {
  label: string;
  value?: string;
  placeholder?: string;
};

type SelectProps = {
  label: string;
  options: string[];
  value?: string;
};

// INPUT Component - Fixed with proper optional props
function Input({ label, value, placeholder, type = "text" }: InputProps) {
  return (
    <div className="w-full">
      <label className="text-[14px] text-gray-600 font-medium block mb-1">
        {label}
      </label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-[8px] p-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

// PASSWORD INPUT Component - Fixed with proper icon placeholder
function PasswordInput({
  label,
  value,
  placeholder = "Enter password",
}: PasswordInputProps) {
  return (
    <div className="w-full">
      <label className="text-[14px] text-gray-600 font-medium block mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="password"
          defaultValue={value}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-[8px] p-3 text-[14px] pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => {
            // Toggle password visibility logic can be added here
            const input = document.querySelector(
              'input[type="password"]',
            ) as HTMLInputElement;
            if (input) {
              input.type = input.type === "password" ? "text" : "password";
            }
          }}
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
function Select({ label, options, value }: SelectProps) {
  return (
    <div className="w-full">
      <label className="text-[14px] text-gray-600 font-medium block mb-1">
        {label}
      </label>
      <select
        defaultValue={value}
        className="w-full border border-gray-300 rounded-[8px] p-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
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
