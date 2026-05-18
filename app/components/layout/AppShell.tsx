"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Navbar from "./Navbar";

type AppShellProps = {
  children: ReactNode;
};

function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const normalizedPathname = pathname.toLowerCase();
  const isSignupRoute = normalizedPathname.startsWith("/signup/");
  const isDashboardRoute = normalizedPathname.startsWith("/dashboard");
  const isUserRoute = normalizedPathname.startsWith("/user");
  const isAdminRoute = normalizedPathname.startsWith("/admin");
  const isAstrologerRoute = normalizedPathname.startsWith("/astrologer");
  const isLoginRoute = normalizedPathname === "/login";

  return (
    <div className="flex min-h-full flex-col">
      {isSignupRoute ||
      isDashboardRoute ||
      isUserRoute ||
      isAdminRoute ||
      isAstrologerRoute ? null : (
        <Navbar overlay={isLoginRoute} />
      )}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

export default AppShell;
