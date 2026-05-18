// components/wallet/Header.tsx
import { Download } from "lucide-react";
import ExportButton from "../CommonComponents/ExportButton";

export default function WalletHeader() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between max-w-[1400px] ">
      <div>
        <h1 className="text-[28px] font-semibold">Wallet & Transactions</h1>
        <p className="text-[14px] font-medium text-gray-500 mt-1">
          Monitor all financial transactions
        </p>
      </div>

      <ExportButton />
    </div>
  );
}
