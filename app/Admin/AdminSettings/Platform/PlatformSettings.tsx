import Image from "next/image";
import ExportButton from "../../CommonComponents/ExportButton";
export default function PlatformSettings() {
  return (
    <div className="space-y-6">
      {/* PLATFORM INFO */}

      <div className=" shadow-sm rounded-xl p-6">
        <h2 className="text-[20px] font-semibold mb-4">Platform Information</h2>

        {/* Row 1 */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Platform Name" value="AstroConnect" />
          <Input label="Platform URL" value="https://astroconnect.com" />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-[16px] text-gray-600">
            Platform Description
          </label>
          <textarea
            className="w-full mt-1 border rounded-[8px] p-3 text-[14px]"
            rows={3}
            defaultValue="Professional astrology consultation platform connecting users with verified astrologers."
          />
        </div>

        {/* Row 2 */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Support Email" value="support@astroconnect.com" />
          <Input label="Support Phone" value="+1 (800) 123-4567" />
        </div>

        {/* Logo Upload */}
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-orange-200">
            <Image
              src="/logo/astro-logo.svg"
              height={60}
              width={60}
              alt="AstroConnect logo"
            />
          </div>

          <button className="border px-4 py-2 rounded-[8px] border-dotted bg-gray-200 text-[14px]">
            Upload New Logo
          </button>
        </div>
      </div>

      {/* REGIONAL SETTINGS */}
      <div className="rounded-xl p-6">
        <h2 className="text-[20px] font-semibold mb-4">Regional Settings</h2>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Select label="Default Language" options={["English"]} />
          <Select label="Time Zone" options={["IST (UTC +5:30)"]} />
          <Select label="Currency" options={["INR (₹)"]} />
        </div>

        <div className="flex justify-end">
          <ExportButton name="Save Platform Settings" type="save" />
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
};

type SelectProps = {
  label: string;
  options: string[];
};

/* INPUT */
function Input({ label, value }: InputProps) {
  return (
    <div>
      <label className="text-[14px] shadow-sm text-gray-600">{label}</label>
      <input
        defaultValue={value}
        className="w-full mt-1 border rounded-[8px] p-3 text-[14px]"
      />
    </div>
  );
}

/* SELECT */
function Select({ label, options }: SelectProps) {
  return (
    <div>
      <label className="text-[14px] text-gray-600">{label}</label>
      <select className="w-full mt-1 border rounded-[8px] p-3 text-[14px]">
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
