import type { ReactNode } from "react";
import AstrologerSidebar from "./CommonComponents/AstrologerSidebar";
import AstrologerHeader from "./CommonComponents/AstrologerHeader";
import AuthGuard from "@/app/components/common/AuthGuard";
import BackgroundStreamMonitor from "@/app/components/BackgroundStreamMonitor";

type AstrologerLayoutProps = {
  children: ReactNode;
};

export default function AstrologerLayout({ children }: AstrologerLayoutProps) {
  return (
    <AuthGuard allowedScope="astrologer" fallbackUrl="/login/astrologer">
      <div className="min-h-svh bg-[#fcfbff]">
        <AstrologerSidebar />
        <div className="md:ml-[230px]">
          <AstrologerHeader />
          {children}
        </div>
      </div>
      {/* Global background broadcast monitor — tears down Agora if broadcast is remotely terminated while on another page */}
      <BackgroundStreamMonitor scope="astrologer" />
    </AuthGuard>
  );
}
