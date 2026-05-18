"use client";

import { useState } from "react";
import PerformanceDashboardModal from "./PerformanceDashboardModal";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="bg-purple-700 text-white px-6 py-2 rounded"
      >
        Open Dashboard
      </button>

      {open && <PerformanceDashboardModal onClose={() => setOpen(false)} />}
    </div>
  );
}
