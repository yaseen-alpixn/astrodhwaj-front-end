// components/user/Header.tsx
import { Download } from "lucide-react";
import ExportButton from "../CommonComponents/ExportButton";
export default function Header() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold">Astrologer Management</h1>
        <p className="text-[14px] font-medium text-gray-500">
          Manage astrologers and approval workflow.
        </p>
      </div>
      <ExportButton />
    </div>
  );
}
