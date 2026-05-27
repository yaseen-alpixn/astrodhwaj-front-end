import type { ReactNode } from "react";
import DashboardSidebar from "./CommonComponents/DashboardSidebar";
import AdminFooter from "./CommonComponents/AdminFooter";
import AuthGuard from "@/app/components/common/AuthGuard";

type AstrologerLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AstrologerLayoutProps) {
  return (
    <AuthGuard allowedScope="admin" fallbackUrl="/login/admin">
      <div className="min-h-svh overflow-x-hidden">
        <DashboardSidebar />
        <main className="min-w-0 overflow-x-hidden bg-white md:ml-[200px]">
          {children}
          <AdminFooter />
        </main>
      </div>
    </AuthGuard>
  );
}
