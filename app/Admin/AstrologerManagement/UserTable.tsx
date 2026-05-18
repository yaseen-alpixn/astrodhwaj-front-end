// components/user/UserTable.tsx
import StatusBadge from "./StatusBadge";
import { Eye, MoreVertical } from "lucide-react";
import Link from "next/link";

const data = Array(9).fill({
  id: "USR001",
  name: "Dr. Priya Sharma",
  status: "Approved",
  sessions: "842 sessions",
});

export default function UserTable() {
  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm">
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
              key={i}
              className="border-b last:border-none text-sm md:text-[14px]"
            >
              <td className="p-3 whitespace-nowrap">{item.id}</td>

              <td className="p-3 whitespace-nowrap">{item.name}</td>

              <td className="p-3 text-center">
                <StatusBadge status={item.status} />
              </td>

              <td className="p-3 text-center whitespace-nowrap">
                {item.sessions}
              </td>

              <td className="p-3">
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] px-2 py-1 text-xs md:text-[13px] rounded-full whitespace-nowrap">
                    Vedic Astrology
                  </span>

                  <span className="bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] px-2 py-1 text-xs md:text-[13px] rounded-full whitespace-nowrap">
                    Tarot
                  </span>

                  <span className="bg-gray-200 px-2 py-1 text-xs md:text-[13px] rounded-full whitespace-nowrap">
                    +1
                  </span>
                </div>
              </td>

              <td className="p-3">
                <div className="flex items-center justify-center gap-3">
                  <Link href="/Admin/AstrologerManagement/AstrologerPopUp">
                    <Eye size={16} className="text-purple-700 cursor-pointer" />
                  </Link>
                  <MoreVertical size={16} className="cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
