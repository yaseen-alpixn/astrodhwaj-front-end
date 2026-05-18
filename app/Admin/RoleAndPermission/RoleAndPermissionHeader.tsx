import { Plus } from "lucide-react";

export default function RoleAndPermissionHeader() {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight">
          Role & Permission Management
        </h1>
        <p className="text-[14px] font-medium text-gray-500">
          Define roles and manage access permissions
        </p>
      </div>

      <button className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-purple-600 to-purple-800 px-[25px] py-[15px] text-white md:w-[210px] whitespace-nowrap">
        <Plus size={18} />
        Add New Role/Member
      </button>
    </div>
  );
}
