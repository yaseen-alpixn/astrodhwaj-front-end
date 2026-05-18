import { Eye, MoreVertical, Tag } from "lucide-react";
import Link from "next/link";

export default function ContentTable() {
  type ContentStatus = "Published" | "Paused" | "Draft";

  const data = [
    { type: "Horoscope", status: "Published" as ContentStatus },
    { type: "Horoscope", status: "Paused" as ContentStatus },
    { type: "Horoscope", status: "Published" as ContentStatus },
    { type: "Tarot", status: "Published" as ContentStatus },
    { type: "Horoscope", status: "Paused" as ContentStatus },
    { type: "Numerology", status: "Published" as ContentStatus },
    { type: "Horoscope", status: "Draft" as ContentStatus },
  ];

  const statusStyles = {
    Published: "bg-green-100 text-green-600",
    Paused: "bg-red-100 text-red-600",
    Draft: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-[1200px] w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">
              Title
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Type
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Category
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Views
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Status
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Date
            </th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {Array(9)
            .fill(0)
            .map((_, i) => {
              const item = data[i % data.length];

              return (
                <tr
                  key={i}
                  className="border-b last:border-none text-sm md:text-[14px]"
                >
                  {/* Title */}
                  <td className="p-3 whitespace-nowrap">
                    Understanding Your Birth Chart
                  </td>

                  {/* Type */}
                  <td className="p-3 text-center">
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs md:text-sm whitespace-nowrap">
                      {item.type}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                      <Tag size={16} />
                      Horoscope
                    </div>
                  </td>

                  {/* Views */}
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                      <Link href="/Admin/ContentManagement/EditContent">
                        <Eye size={16} />
                      </Link>
                      2,345
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-3 text-center whitespace-nowrap">
                    26 Mar 2026
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-3">
                      <Link href="/Admin/ContentManagement/EditContent">
                        <Eye
                          size={18}
                          className="text-purple-700 cursor-pointer"
                        />
                      </Link>
                      <MoreVertical size={18} className="cursor-pointer" />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
