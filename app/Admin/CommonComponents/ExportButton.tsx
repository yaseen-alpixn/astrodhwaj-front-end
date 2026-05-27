"use client";

import { Download, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { adminDownload } from "../api";

interface ExportButtonProps {
  name?: string;
  type?: "export" | "add" | "save";
  onClick?: () => void;
}

export default function ExportButton({
  name,
  type = "export",
  onClick,
}: ExportButtonProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const exportPath = pathname.includes("UserManagement")
    ? "/admin/users/export"
    : pathname.includes("AstrologerManagement")
    ? "/admin/astrologers/export"
    : pathname.includes("WalletTransaction")
    ? "/admin/transactions/export"
    : pathname.includes("RoleAndPermission")
    ? "/admin/audit-logs/export"
    : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = async (format: "csv" | "xlsx" | "pdf") => {
    if (!exportPath) return;
    setIsOpen(false);
    try {
      const blob = await adminDownload(`${exportPath}?format=${format}`);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportPath.split("/").pop() || "export"}_${Date.now()}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (type !== "export" || !exportPath) return;
    setIsOpen(!isOpen);
  };

  if (type !== "export") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 rounded-lg bg-[#4898E1] text-white whitespace-nowrap justify-center h-[42px] px-[18px] text-[16px] md:w-[185px]`}
      >
        {type === "add" && <Plus size={18} />}
        {name || "Save"}
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 rounded-lg bg-[#4898E1] text-white whitespace-nowrap justify-center h-[42px] px-[18px] text-[16px] md:w-[185px]"
      >
        {name || "Export Data"}
        <Download size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-100">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleDownload("csv")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
            >
              Export as CSV (.csv)
            </button>
            <button
              onClick={() => handleDownload("xlsx")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
            >
              Export as Excel (.xlsx)
            </button>
            <button
              onClick={() => handleDownload("pdf")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
            >
              Export as PDF (.pdf)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
