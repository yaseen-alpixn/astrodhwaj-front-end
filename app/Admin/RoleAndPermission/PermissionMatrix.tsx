"use client";

import { Eye, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "../api";
import type { Role } from "./RoleCards";

type PermissionResponse = {
  matrix: Record<string, string[]>;
};

export default function PermissionMatrix({ roles = [], onEditRole }: { roles?: Role[]; onEditRole?: (role: Role) => void }) {
  const [rows, setRows] = useState<[string, string[]][]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi<PermissionResponse>("/admin/permissions")
      .then((response) => setRows(Object.entries(response.data.matrix || {})))
      .catch(() => setRows([]));
  }, []);

  const filteredRows = rows.filter(([module]) => module.toLowerCase().includes(search.toLowerCase()));
  const superAdmin = roles.find((role) => role.slug === "super_admin") || roles[0];
  const financeAdmin = roles.find((role) => role.slug === "finance_admin") || roles[1];
  const supportAdmin = roles.find((role) => role.slug === "support_admin") || roles[2];

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Permission Matrix</h2>
          <p className="text-sm text-gray-500">Overview of all role permissions</p>
        </div>

        <div className="relative w-full md:max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input placeholder="Search by module, role..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full h-[42px] border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]" />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[1300px] w-full">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">Module</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Super Admin</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Finance Admin</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Support Admin</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map(([module, permissions], index) => (
              <tr key={module || index} className="border-b last:border-none text-sm md:text-[14px]">
                <td className="p-3 whitespace-nowrap">{module}</td>
                <td className="p-3"><div className="flex flex-wrap justify-center gap-2">{permissions.map((permission) => <Tag key={permission} label={permission.split(":")[1] || "View"} color="bg-[#4898E1]/10 text-[#4898E1]" />)}</div></td>
                <td className="p-3 text-center"><Tag label={financeAdmin?.permissions?.some((permission) => permissions.includes(permission)) ? "Enabled" : "View"} color="bg-[#4898E1]/10 text-[#4898E1]" /></td>
                <td className="p-3 text-center"><Tag label={supportAdmin?.permissions?.some((permission) => permissions.includes(permission)) ? "Enabled" : "View"} color="bg-[#4898E1]/10 text-[#4898E1]" /></td>
                <td className="p-3">
                  <div className="flex justify-center gap-3 text-[#4898E1]">
                    <Link href="/Admin/RoleAndPermission/PermissionPopUp"><Eye size={18} className="cursor-pointer" /></Link>
                    <MoreVertical size={18} className="cursor-pointer" onClick={() => superAdmin && onEditRole?.(superAdmin)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-5">
        <button className="border px-3 py-1 rounded-lg">{"<"}</button>
        <span className="text-sm">Page 1 of 1</span>
        <button className="border px-3 py-1 rounded-lg">{">"}</button>
      </div>
    </div>
  );
}

type TagProps = { label: string; color: string };

function Tag({ label, color }: TagProps) {
  return <span className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${color}`}>{label}</span>;
}
