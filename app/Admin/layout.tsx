import type { ReactNode } from "react";
import DashboardSidebar from "./CommonComponents/DashboardSidebar";
import AdminFooter from "./CommonComponents/AdminFooter";

type AstrologerLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AstrologerLayoutProps) {
  return (
    <div className="min-h-svh overflow-x-hidden">
      <DashboardSidebar />
      <main className="min-w-0 overflow-x-hidden bg-white md:ml-[200px]">
        {children}
        <AdminFooter />
      </main>
    </div>
  );
}
