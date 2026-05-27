"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasPermission } from "@/services/api";

type AuthGuardProps = {
  children: React.ReactNode;
  allowedScope: "user" | "astrologer" | "admin";
  fallbackUrl: string;
};

export default function AuthGuard({ children, allowedScope, fallbackUrl }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setAuthorized(false);
  }

  useEffect(() => {
    // Client-side authentication check using dynamic localStorage keys
    void Promise.resolve().then(() => {
      const token = localStorage.getItem(`${allowedScope}_access_token`);
      if (!token) {
        router.push(fallbackUrl);
      } else {
        const permission = allowedScope === "admin" ? inferAdminRoutePermission(pathname) : null;
        if (permission && !hasPermission(permission, "admin")) {
          router.push("/unauthorized");
          return;
        }
        setAuthorized(true);
      }
    });
  }, [allowedScope, fallbackUrl, pathname, router]);

  if (!authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#fcfbff]">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0085FF] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Securing Connection...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function inferAdminRoutePermission(pathname: string) {
  if (!pathname.startsWith("/Admin")) return null;
  if (pathname.includes("/UserManagement")) return "users:read";
  if (pathname.includes("/AstrologerManagement")) return "astrologers:read";
  if (pathname.includes("/PricingAndCommition")) return "pricing:read";
  if (pathname.includes("/WalletTransaction")) return "transactions:read";
  if (pathname.includes("/Payouts")) return "payouts:read";
  if (pathname.includes("/ContentManagement")) return "content:read";
  if (pathname.includes("/LiveSession")) return "live_sessions:read";
  if (pathname.includes("/ReportAnalytics")) return "analytics:read";
  if (pathname.includes("/SupportAndTicketSystem")) return "support:read";
  if (pathname.includes("/RoleAndPermission")) return "roles:read";
  if (pathname.includes("/AdminSettings")) return "settings:read";
  if (pathname.includes("/AuditLogs")) return "audit_logs:read";
  if (pathname.includes("/Notifications")) return "notifications:read";
  if (pathname.includes("/Payouts")) return "payouts:read";
  return "dashboard:read";
}
