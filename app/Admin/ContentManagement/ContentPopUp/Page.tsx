"use client";

import { useState } from "react";
import ContentAnalyticsModal from "./ContentAnalyticsModal";

export default function AdminPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 bg-violet-50">
      {/* OPEN BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-purple-700 px-6 py-2 text-white"
      >
        Open Analytics Modal
      </button>

      {/* MODAL */}
      {open && (
        <>
          <ContentAnalyticsModal />

          {/* BACKDROP CLICK TO CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
          />
        </>
      )}
    </div>
  );
}
