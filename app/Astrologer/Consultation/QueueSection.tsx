import QueueCard from "./QueueCard";

export default function QueueSection() {
  const data = ["Audio Call", "Video Call", "Chat"];

  return (
    <div className="space-y-4 w-full">
      {data.map((type, i) => (
        <QueueCard key={i} type={type} />
      ))}
    </div>
  );
}
