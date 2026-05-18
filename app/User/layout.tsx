import type { ReactNode } from "react";

import DashboardHeader from "@/app/User/DashboardHeader";
import DashboardSidebar from "@/app/User/DashboardSidebar";

type UserLayoutProps = {
  children: ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-svh bg-[#fcfbff]">
      <div className="flex min-h-svh flex-col md:flex-row md:">
        <DashboardSidebar />
        <div className="flex-1 md:ml-[220px]">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </div>
  );
}
