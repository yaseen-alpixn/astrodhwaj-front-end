// components/pricing/Header.tsx
import { Download } from "lucide-react";
import ExportButton from "../CommonComponents/ExportButton";
export default function Header() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight">
          Commission & Pricing Control
        </h1>
        <p className="text-[14px] font-medium text-gray-500">
          Manage platform commissions and pricing across services
        </p>
      </div>
      <ExportButton />
    </div>
  );
}
