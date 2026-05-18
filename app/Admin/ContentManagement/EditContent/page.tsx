"use client";

import { useState } from "react";
import EditContentModal from "./EditContentModal";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 bg-white">
      <button
        onClick={() => setOpen(true)}
        className="bg-[#4898E1] text-white px-5 py-2 rounded"
      >
        Open Edit Modal
      </button>

      {open && (
        <>
          <EditContentModal onClose={() => setOpen(false)} />

          {/* BACKDROP CLICK */}
          <button
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
          />
        </>
      )}
    </div>
  );
}
