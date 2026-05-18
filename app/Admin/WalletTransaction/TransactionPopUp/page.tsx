"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TransactionDetailsModal from "./TransactionDetailsModal";

export default function AdminPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 bg-violet-50">
      {/* OPEN BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-green-600 px-6 py-2 text-white"
      >
        Open Transaction Details
      </button>

      {/* MODAL */}
      {open && (
        <>
          <TransactionDetailsModal onClose={() => router.back()} />

          {/* CLICK OUTSIDE TO CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
          />
        </>
      )}
    </div>
  );
}
