"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <section className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-[#171717]">Permission denied</h1>
        <p className="mt-2 text-sm text-gray-500">Your admin role does not allow access to this page.</p>
        <Link href="/Admin/DashBoardOverview" className="mt-5 inline-flex rounded-lg bg-[#4898E1] px-4 py-2 text-sm font-medium text-white">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
