"use client";

import { X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[15px] cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-[#4898E1]"
      />
      {label}
    </label>
  );
}
import { useState } from "react";

export default function EditPermissionModal() {
  const router = useRouter();
  const [permissions, setPermissions] = useState({
    superAdmin: {
      view: true,
      edit: true,
      delete: true,
      denied: false,
    },
    financeAdmin: {
      view: true,
      edit: false,
      delete: false,
      denied: false,
    },
    supportAdmin: {
      view: false,
      edit: false,
      delete: false,
      denied: true,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-[830px] bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-[22px] font-medium">Edit Permission</h2>
          <button onClick={() => router.back()}>
            <X size={28} />
          </button>
        </div>

        <div className="p-5">
          {/* Module Select */}
          <div>
            <label className="block text-[16px] mb-2">Module</label>

            <div className="relative">
              <select className="w-full h-[46px] border rounded-xl px-4 appearance-none text-[16px] outline-none">
                <option>Dashboard</option>
              </select>

              <ChevronDown
                size={22}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>

          {/* Super Admin */}
          <PermissionBox title="For Sumer Admin:">
            <Checkbox
              label="View"
              checked={permissions.superAdmin.view}
              onChange={() => {}}
            />
            <Checkbox
              label="Edit"
              checked={permissions.superAdmin.edit}
              onChange={() => {}}
            />
            <Checkbox
              label="Delete"
              checked={permissions.superAdmin.delete}
              onChange={() => {}}
            />
          </PermissionBox>

          {/* Finance Admin */}
          <PermissionBox title="For Finance Admin:">
            <Checkbox
              label="View"
              checked={permissions.financeAdmin.view}
              onChange={() => {}}
            />
            <Checkbox
              label="Edit"
              checked={permissions.financeAdmin.edit}
              onChange={() => {}}
            />
            <Checkbox
              label="Delete"
              checked={permissions.financeAdmin.delete}
              onChange={() => {}}
            />
            <Checkbox
              label="Denied all"
              checked={permissions.financeAdmin.denied}
              onChange={() => {}}
            />
          </PermissionBox>

          {/* Support Admin */}
          <PermissionBox title="For Support Admin:">
            <Checkbox
              label="View"
              checked={permissions.supportAdmin.view}
              onChange={() => {}}
            />
            <Checkbox
              label="Edit"
              checked={permissions.supportAdmin.edit}
              onChange={() => {}}
            />
            <Checkbox
              label="Delete"
              checked={permissions.supportAdmin.delete}
              onChange={() => {}}
            />
            <Checkbox
              label="Denied all"
              checked={permissions.supportAdmin.denied}
              onChange={() => {}}
            />
          </PermissionBox>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button className="w-full sm:w-[235px] h-[48px] rounded-xl bg-[#4898E1] text-white text-[20px] font-medium">
              Update
            </button>

            <button className="w-full sm:w-[235px] h-[48px] rounded-xl border text-[20px] font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PermissionBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mt-5">
      <h3 className="text-[16px] font-medium mb-3">{title}</h3>

      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}
