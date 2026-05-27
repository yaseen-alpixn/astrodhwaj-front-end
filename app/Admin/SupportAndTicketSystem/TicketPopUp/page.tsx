"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import TicketDetailsModal from "./TicketDetailsModal";

function TicketPopupContent() {
  const [open, setOpen] = useState(true);
  const params = useSearchParams();
  const ticketId = params.get("id") || undefined;

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-[#4898E1] text-white px-5 py-2 rounded"
      >
        Open Ticket
      </button>

      {open && (
        <>
          <TicketDetailsModal ticketId={ticketId} onClose={() => setOpen(false)} />

          {/* OVERLAY CLICK */}
          <button
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
          />
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6" />}>
      <TicketPopupContent />
    </Suspense>
  );
}
