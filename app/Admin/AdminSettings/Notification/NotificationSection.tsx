"use client";

import { useState } from "react";

export default function NotificationSection() {
  const [settings, setSettings] = useState([
    {
      title: "User Registration Notifications",
      desc: "Notify admins when new users register",
      enabled: true,
    },
    {
      title: "Transaction Alerts",
      desc: "Get notified about high-value transactions",
      enabled: true,
    },
    {
      title: "Astrologer Approval Requests",
      desc: "Notify when astrologers apply for verification",
      enabled: true,
    },
    {
      title: "Support Ticket Notifications",
      desc: "Alert when new support tickets are created",
      enabled: true,
    },
    {
      title: "Daily Reports",
      desc: "Receive daily analytics summary via email",
      enabled: true,
    },
  ]);

  const toggle = (index: number) => {
    const updated = [...settings];
    updated[index].enabled = !updated[index].enabled;
    setSettings(updated);
  };

  return (
    <div className="shadow-sm rounded-xl p-6 bg-white">
      <h2 className="text-[20px] font-semibold mb-4">
        Push Notification Settings
      </h2>

      {settings.map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-4 mb-3 rounded-lg bg-gray-100"
        >
          {/* Text */}
          <div>
            <h3 className="text-[16px] font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>

          {/* Toggle */}
          <button
            onClick={() => toggle(i)}
            className={`w-[42px] h-[22px] flex items-center px-1 rounded-full transition ${
              item.enabled ? "bg-[#4898E1] justify-end" : "bg-gray-300"
            }`}
          >
            <div className="w-[16px] h-[16px] bg-white rounded-full" />
          </button>
        </div>
      ))}
    </div>
  );
}
