"use client";

import { X } from "lucide-react";
import UserSections from "./UserSections";

export default function UserAnalyticsModal({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="max-h-[90vh] w-[min(900px,95vw)] overflow-y-auto rounded-xl bg-white p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[22px] font-semibold">User Profile Analytics</h1>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* User Info */}
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center">
              R
            </div>

            <div>
              <h2 className="font-medium text-[18px]">Rahul Kumar</h2>
              <p className="text-sm text-gray-500">UID: USR001</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full">
              Active
            </span>
            <span>Joined 15 Jan 2026</span>
            <span>Last active 2 hours ago</span>
          </div>
        </div>

        {/* Sections */}
        <UserSections />

        {/* Footer */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-md">
            Send Message
          </button>
          <button className="border border-red-500 text-red-500 px-6 py-2 rounded-md">
            Block User
          </button>
        </div>
      </div>
    </div>
  );
}
