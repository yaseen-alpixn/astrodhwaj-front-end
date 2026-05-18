"use client";

import { useState } from "react";
import Tabs from "./Tabs";
import QueueSection from "./QueueSection";
import SessionSection from "./SessionSection";

export default function Consultation() {
  const [active, setActive] = useState("Queue (3)");

  return (
    <div className="mx-auto w-full space-y-6 p-4 md:p-6 w-full">
      <Tabs active={active} setActive={setActive} />

      {active === "Queue (3)" && <QueueSection />}
      {active === "Scheduled" && <SessionSection status="Confirmed" />}
      {active === "Completed" && <SessionSection status="Completed" />}
      {active === "Waiting" && <SessionSection status="Waiting" />}
    </div>
  );
}
