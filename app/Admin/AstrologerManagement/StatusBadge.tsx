// components/user/StatusBadge.tsx
type BadgeStatus = "Approved" | "Pending" | "Rejected" | "Completed" | "Closed";

type StatusBadgeProps = {
  status: BadgeStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Approved: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Rejected: "bg-red-100 text-red-600",
    Completed: "bg-green-100 text-green-600",
    Closed: "bg-gray-200 text-gray-600",
  };

  return (
    <span
      className={`px-[10px] py-[5px] rounded-full text-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
}
