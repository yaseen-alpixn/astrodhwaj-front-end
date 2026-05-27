import SessionCard from "./SessionCard";

type SessionSectionProps = {
  status: string;
};

export default function SessionSection({ status }: SessionSectionProps) {
  const data = new Array(4).fill("call");

  return (
    <div className="space-y-4 w-full">
      {data.map((_, i) => (
        <SessionCard key={i} id={String(i)} name="Client Name" time="10:00 AM" duration={15} status={status} type="Audio Call" />
      ))}
    </div>
  );
}
