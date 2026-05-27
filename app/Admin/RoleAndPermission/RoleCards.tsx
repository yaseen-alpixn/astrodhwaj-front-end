import Image from "next/image";
import { titleCase } from "../api";

export type Role = {
  id: string;
  name: string;
  slug: string;
  permissions?: string[];
  hierarchy_level?: number;
  rank?: number;
  status?: string;
};

export function getRoleRank(hierarchyLevel?: number): number {
  if (hierarchyLevel === undefined) return 4;
  if (hierarchyLevel <= 0) return 1;
  if (hierarchyLevel <= 10) return 2;
  if (hierarchyLevel <= 20) return 3;
  return 4;
}

export function getRankLabel(rank: number): string {
  const labels: Record<number, string> = {
    1: "Rank 1 — Super Admin",
    2: "Rank 2 — Finance Admin",
    3: "Rank 3 — Support Admin",
    4: "Rank 4 — Content Admin",
  };
  return labels[rank] || "Rank 4 — Content Admin";
}

export default function RoleCards({ roles = [], onEdit }: { roles?: Role[]; onEdit?: (role: Role) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-2 xl:max-w-full">
      {roles.map((role, i) => (
        <div
          key={role.id || i}
          onClick={() => onEdit?.(role)}
          className="min-h-[170px] p-4 bg-white rounded-xl shadow-sm flex flex-col justify-between cursor-pointer border border-transparent hover:border-[#4898E1]/40 transition-all"
        >
          <div className="w-12 h-12 bg-[#4898E1]/10 flex items-center justify-center rounded-xl">
            <Image src="/images/twoRoles.png" width={22} height={22} alt="permission" />
          </div>

          <div className="mt-4">
            <h3 className="text-sm md:text-[15px] font-semibold">{role.name || titleCase(role.slug)}</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{(role.permissions || []).length} permissions enabled</p>
            <div className="mt-3 flex">
              <span className="bg-gray-100 px-2.5 py-0.5 rounded text-xs font-semibold text-gray-700 border border-gray-200/50">
                {getRankLabel(getRoleRank(role.hierarchy_level))}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
