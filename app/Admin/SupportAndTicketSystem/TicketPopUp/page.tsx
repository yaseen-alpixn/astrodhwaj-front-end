"use client";

import { useState } from "react";
import TicketDetailsModal from "./TicketDetailsModal";

export default function Page() {
  const [open, setOpen] = useState(false);

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
          <TicketDetailsModal onClose={() => setOpen(false)} />

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
