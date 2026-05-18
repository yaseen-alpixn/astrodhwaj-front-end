import { Download, Plus } from "lucide-react";

interface ExportButtonProps {
  name?: string;
  type?: "export" | "add" | "save";
}

export default function ExportButton({
  name,
  type = "export",
}: ExportButtonProps) {
  return (
    <button
      className={`flex items-center gap-2 rounded-lg bg-violet-700 text-white whitespace-nowrap justify-center
      ${
        type === "save"
          ? "h-[40px] px-5 text-[14px] md:w-[170px]"
          : "h-[42px] px-[18px] text-[16px] md:w-[185px]"
      }`}
    >
      {type === "add" && <Plus size={18} />}

      {name || "Export Data"}

      {type === "export" && <Download size={18} />}
    </button>
  );
}
