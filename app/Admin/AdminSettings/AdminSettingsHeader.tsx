"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Platform Settings", href: "/Admin/AdminSettings" },
  { label: "Email & SMS", href: "/Admin/AdminSettings/EmailAndSMS" },
  { label: "Payment Gateway", href: "/Admin/AdminSettings/PaymentGateway" },
  { label: "Notifications", href: "/Admin/AdminSettings/Notification" },
  { label: "Security", href: "/Admin/AdminSettings/Security" },
];

export default function AdminSettingsHeader() {
  const pathname = usePathname();

  return (
    <div className="mb-4">
      <h1 className="text-[28px] font-semibold">Admin Settings</h1>
      <p className="mt-2 text-[14px] font-medium text-gray-500">
        Manage platform configuration and system settings
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-2 text-[14px] ${
                isActive
                  ? "border-b-2 border-purple-700 text-purple-700"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
