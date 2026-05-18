// components/settings/PaymentGatewaySection.tsx
"use client";

export default function GatewaySection() {
  const gateways = [
    {
      name: "Razorpay",
      desc: "Primary payment gateway for India",
      enabled: true,
      highlight: true,
      fields: ["API Key", "Secret Key"],
    },
    {
      name: "Stripe",
      desc: "International payment gateway",
      enabled: false,
      fields: ["Publishable Key", "Secret Key"],
    },
    {
      name: "PayPal",
      desc: "Global payment solution",
      enabled: false,
      fields: ["Client ID", "Client Secret"],
    },
  ];

  return (
    <div className=" shadow-sm rounded-xl p-6 bg-white">
      <h2 className="text-[20px] font-semibold mb-4">
        Payment Gateway Configuration
      </h2>

      {gateways.map((g, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl mb-4 ${
            g.highlight ? "bg-[#4898E1]/10" : "border"
          }`}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[16px] font-medium">{g.name}</h3>
              <p className="text-sm text-gray-500">{g.desc}</p>
            </div>

            {/* Toggle */}
            <div
              className={`w-[40px] h-[20px] rounded-full flex items-center px-1 ${
                g.enabled ? "bg-[#4898E1] justify-end" : "bg-gray-300"
              }`}
            >
              <div className="w-[14px] h-[14px] bg-white rounded-full" />
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              placeholder={g.fields[0]}
              className="border rounded-md h-[40px] px-3 text-sm bg-white"
            />
            <input
              placeholder={g.fields[1]}
              className="border rounded-md h-[40px] px-3 text-sm bg-white"
            />
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-[#4898E1] text-white px-6 py-2 rounded-md">
          Save Payment Settings
        </button>
      </div>
    </div>
  );
}
