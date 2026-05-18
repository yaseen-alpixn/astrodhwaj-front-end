import SessionCard from "./SessionCard";

export default function SessionSection({ status }: any) {
  const data = new Array(4).fill("call");

  return (
    <div className="space-y-4 w-full">
      {data.map((_, i) => (
        <SessionCard key={i} status={status} type="Audio Call" />
      ))}
    </div>
  );
}
