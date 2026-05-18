import LiveSessionCard from "./LiveSessionCard";

import PastStreams from "./PastStreams";

export default function LiveDashboard() {
  return (
    <div className="space-y-6 px-4 md:px-6">
      <LiveSessionCard />

      <PastStreams />
    </div>
  );
}
