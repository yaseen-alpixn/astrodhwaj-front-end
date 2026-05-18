"use client";

import { useRouter } from "next/navigation";
import UserAnalyticsModal from "./UserAnalyticsModal";

export default function Page() {
  const router = useRouter();
  return <UserAnalyticsModal onClose={() => router.back()} />;
}
