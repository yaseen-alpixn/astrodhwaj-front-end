"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, hasPermission } from "../../services/api";
import { adminApi } from "../Admin/api";

export default function AutoLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      // 1. Check Admin Session
      const hasAdminToken = localStorage.getItem("admin_access_token") || localStorage.getItem("admin_refresh_token");
      if (hasAdminToken) {
        try {
          const res = await adminApi("/admin/validate-session");
          if (res.success) {
            let targetRoute = "/Admin/DashBoardOverview";
            if (!hasPermission("dashboard:read", "admin")) {
              const routesToCheck = [
                { perm: "users:read", path: "/Admin/UserManagement" },
                { perm: "astrologers:read", path: "/Admin/AstrologerManagement" },
                { perm: "pricing:read", path: "/Admin/PricingAndCommition" },
                { perm: "transactions:read", path: "/Admin/WalletTransaction" },
                { perm: "payouts:read", path: "/Admin/Payouts" },
                { perm: "content:read", path: "/Admin/ContentManagement" },
                { perm: "live_sessions:read", path: "/Admin/LiveSession" },
                { perm: "analytics:read", path: "/Admin/ReportAnalytics" },
                { perm: "support:read", path: "/Admin/SupportAndTicketSystem" },
                { perm: "roles:read", path: "/Admin/RoleAndPermission" },
                { perm: "settings:read", path: "/Admin/AdminSettings" },
                { perm: "audit_logs:read", path: "/Admin/AuditLogs" },
                { perm: "notifications:read", path: "/Admin/Notifications" }
              ];
              const allowed = routesToCheck.find(r => hasPermission(r.perm, "admin"));
              targetRoute = allowed ? allowed.path : "/unauthorized";
            }
            router.replace(targetRoute);
            return;
          }
        } catch (err) {
          // Token invalid or session expired
        }
      }

      // 2. Check Astrologer Session
      const hasAstroToken = localStorage.getItem("astrologer_access_token") || localStorage.getItem("astrologer_refresh_token");
      if (hasAstroToken) {
        try {
          const res = await api("/astrologer/profile", {}, "astrologer");
          if (res.success) {
            router.replace("/Astrologer/AstrologerHome");
            return;
          }
        } catch (err) {
          // Token invalid or session expired
        }
      }

      // 3. Check Seeker (User) Session
      const hasUserToken = localStorage.getItem("user_access_token") || localStorage.getItem("user_refresh_token");
      if (hasUserToken) {
        try {
          const res = await api("/users/profile", {}, "user");
          if (res.success) {
            router.replace("/User/home");
            return;
          }
        } catch (err) {
          // Token invalid or session expired
        }
      }
    }

    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, [router]);

  return null;
}
