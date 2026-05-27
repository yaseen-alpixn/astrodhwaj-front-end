// components/settings/PaymentGatewaySection.tsx
"use client";

import { useEffect, useState } from "react";
import { adminApi } from "../../api";

type Gateway = {
  name: string;
  desc: string;
  enabled: boolean;
  highlight?: boolean;
  fields: string[];
  api_key?: string;
  secret_key?: string;
};

const defaultGateways: Gateway[] = [
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

function normalizeGateway(gateway: Partial<Gateway>, fallback: Gateway): Gateway {
  const fields = Array.isArray(gateway.fields) && gateway.fields.length >= 2 ? gateway.fields : fallback.fields;
  return {
    ...fallback,
    ...gateway,
    name: gateway.name || fallback.name,
    desc: gateway.desc || fallback.desc,
    enabled: Boolean(gateway.enabled),
    fields,
  };
}

export default function GatewaySection() {
  const [gateways, setGateways] = useState<Gateway[]>(defaultGateways);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminApi<{ values?: { gateways?: Gateway[] } }>("/admin/settings/payment")
      .then((response) => {
        const saved = response.data.values?.gateways || [];
        if (saved.length) {
          setGateways(defaultGateways.map((fallback) => {
            const gateway = saved.find((item) => item.name?.toLowerCase() === fallback.name.toLowerCase());
            return normalizeGateway(gateway || {}, fallback);
          }));
        }
      })
      .catch(() => undefined);
  }, []);

  const updateGateway = (index: number, key: keyof Gateway, value: string | boolean) => {
    setGateways((current) => current.map((gateway, i) => i === index ? { ...gateway, [key]: value } : gateway));
  };

  const save = () => {
    adminApi("/admin/settings/payment", { method: "PUT", body: JSON.stringify({ values: { gateways } }) })
      .then(() => setMessage("Saved"))
      .catch((err) => setMessage(err instanceof Error ? err.message : "Save failed"));
  };

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
            <button
              onClick={() => updateGateway(i, "enabled", !g.enabled)}
              className={`w-[40px] h-[20px] rounded-full flex items-center px-1 ${
                g.enabled ? "bg-[#4898E1] justify-end" : "bg-gray-300"
              }`}
            >
              <div className="w-[14px] h-[14px] bg-white rounded-full" />
            </button>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              placeholder={g.fields[0]}
              value={g.api_key || ""}
              onChange={(event) => updateGateway(i, "api_key", event.target.value)}
              className="border rounded-md h-[40px] px-3 text-sm bg-white"
            />
            <input
              placeholder={g.fields[1]}
              value={g.secret_key || ""}
              onChange={(event) => updateGateway(i, "secret_key", event.target.value)}
              className="border rounded-md h-[40px] px-3 text-sm bg-white"
            />
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={save} className="bg-[#4898E1] text-white px-6 py-2 rounded-md">
          Save Payment Settings
        </button>
      </div>
      {message && <p className="mt-3 text-right text-sm text-gray-500">{message}</p>}
    </div>
  );
}
