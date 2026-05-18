import type { ReactNode } from "react";
import AstrologerSidebar from "./CommonComponents/AstrologerSidebar";
import AstrologerHeader from "./CommonComponents/AstrologerHeader";
type AstrologerLayoutProps = {
  children: ReactNode;
};

export default function AstrologerLayout({ children }: AstrologerLayoutProps) {
  return (
    <div className="min-h-svh bg-[#fcfbff]">
      <AstrologerSidebar />
      <div className="md:ml-[230px]">
        <AstrologerHeader />
        {children}
      </div>
    </div>
  );
}
