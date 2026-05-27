import StatusBadge from "./StatusBadge";
import { Eye, MoreVertical } from "lucide-react";
import Link from "next/link";
import type { AdminAstrologer } from "./page";
import { useState, useRef, useEffect } from "react";

export default function UserTable({
  data = [],
  onAction,
  onDelete,
}: {
  data?: AdminAstrologer[];
  onAction?: (id: string, action: "approve" | "reject") => void;
  onDelete?: (id: string) => void;
}) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm" ref={dropdownRef}>
      <table className="min-w-[1100px] w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">
              Astrologer ID
            </th>
            <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">
              Astrologer Info
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Status
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Performance
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Expertise
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr
              key={item.id || i}
              className="border-b last:border-none text-sm md:text-[14px]"
            >
              <td className="p-3 whitespace-nowrap">{item.astrologer_code || item.id?.slice(-6).toUpperCase()}</td>

              <td className="p-3 whitespace-nowrap">{item.display_name}</td>

              <td className="p-3 text-center">
                <StatusBadge status={item.approval_status} />
              </td>

              <td className="p-3 text-center whitespace-nowrap">
                {item.total_sessions || 0} sessions
              </td>

              <td className="p-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  {(item.expertise || []).slice(0, 2).map((expertise) => (
                    <span key={expertise} className="bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] px-2 py-1 text-xs md:text-[13px] rounded-full whitespace-nowrap">
                      {expertise}
                    </span>
                  ))}

                  {(item.expertise || []).length > 2 && (
                    <span className="bg-gray-200 px-2 py-1 text-xs md:text-[13px] rounded-full whitespace-nowrap">
                      +{(item.expertise || []).length - 2}
                    </span>
                  )}
                </div>
              </td>

              <td className="p-3 relative">
                <div className="flex items-center justify-center gap-3">
                  <Link href={`/Admin/AstrologerManagement/AstrologerPopUp?id=${item.id}`}>
                    <Eye size={16} className="text-[#4898E1] cursor-pointer" />
                  </Link>
                  <MoreVertical
                    size={16}
                    className="cursor-pointer"
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                  />

                  {activeDropdown === item.id && (
                    <div className="absolute right-4 mt-6 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40 border border-gray-100">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            const action = item.approval_status === "approved" ? "reject" : "approve";
                            onAction?.(item.id, action);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {item.approval_status === "approved" ? "Reject Astrologer" : "Approve Astrologer"}
                        </button>
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onDelete?.(item.id);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete Astrologer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
