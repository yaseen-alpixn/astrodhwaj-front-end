import type { ReactNode } from "react";
import DashboardHeader from "@/app/User/DashboardHeader";
import DashboardSidebar from "@/app/User/DashboardSidebar";
import AuthGuard from "@/app/components/common/AuthGuard";
import BackgroundStreamMonitor from "@/app/components/BackgroundStreamMonitor";

type UserLayoutProps = {
  children: ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <AuthGuard allowedScope="user" fallbackUrl="/login/user">
      <div className="min-h-svh bg-[#fcfbff]">
        <div className="flex min-h-svh flex-col md:flex-row">
          <DashboardSidebar />
          <div className="flex-1 md:ml-[220px]">
            <DashboardHeader />
            {children}
          </div>
        </div>
      </div>
      {/* Global background stream monitor — tears down Agora if session ends while user is on another page */}
      <BackgroundStreamMonitor scope="user" />
    </AuthGuard>
  );
}
