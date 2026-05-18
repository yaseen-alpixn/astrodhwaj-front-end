import { Eye, MoreVertical, Search } from "lucide-react";
import Link from "next/link";

export default function PermissionMatrix() {
  const rows = new Array(9).fill("Dashboard");

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">
            Permission Matrix
          </h2>

          <p className="text-sm text-gray-500">
            Overview of all role permissions
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-[300px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />

          <input
            placeholder="Search by module, role..."
            className="w-full h-[42px] border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1300px] w-full">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">
                Module
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Super Admin
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Finance Admin
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Support Admin
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item, index) => (
              <tr
                key={index}
                className="border-b last:border-none text-sm md:text-[14px]"
              >
                <td className="p-3 whitespace-nowrap">{item}</td>

                {/* Super Admin */}
                <td className="p-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    <Tag label="Edit" color="bg-yellow-100 text-yellow-700" />
                    <Tag label="View" color="bg-[#4898E1]/10 text-[#4898E1]" />
                    <Tag label="Delete" color="bg-red-100 text-red-600" />
                  </div>
                </td>

                {/* Finance */}
                <td className="p-3 text-center">
                  <Tag label="View" color="bg-[#4898E1]/10 text-[#4898E1]" />
                </td>

                {/* Support */}
                <td className="p-3 text-center">
                  <Tag label="View" color="bg-[#4898E1]/10 text-[#4898E1]" />
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex justify-center gap-3 text-[#4898E1]">
                    <Link href="/Admin/RoleAndPermission/PermissionPopUp">
                      <Eye size={18} className="cursor-pointer" />
                    </Link>
                    <MoreVertical size={18} className="cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-5">
        <button className="border px-3 py-1 rounded-lg">{"<"}</button>

        <span className="text-sm">Page 1 of 10</span>

        <button className="border px-3 py-1 rounded-lg">{">"}</button>
      </div>
    </div>
  );
}

type TagProps = {
  label: string;
  color: string;
};

function Tag({ label, color }: TagProps) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${color}`}
    >
      {label}
    </span>
  );
}
