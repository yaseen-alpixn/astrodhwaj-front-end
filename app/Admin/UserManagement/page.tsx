"use client";

import ExportButton from "../CommonComponents/ExportButton";
import Image from "next/image";
import {
  Search,
  Mail,
  Phone,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import Link from "next/link";

export default function Page() {
  const stats = [
    {
      title: "Total Users",
      value: "6",
      src: "/images/users.png",
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Active Users",
      value: "5",
      src: "/images/activeUsers.png",
      bg: "bg-purple-100",
      color: "text-violet-700",
    },
    {
      title: "Blocked Users",
      value: "1",
      src: "/images/blockedUsers.png",
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Total Revenue",
      value: "₹45K",
      src: "/images/Group.png",
      bg: "bg-green-100",
      color: "text-green-600",
    },
  ];

  const users = Array(9).fill({ status: "Active" });

  return (
    <>
      <AdminTopHeader />

      <main className="min-h-screen w-full overflow-x-hidden bg-violet-50 px-3 py-6 sm:px-5 md:px-8">
        <div className="mx-auto max-w-[1400px] space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                User Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage and monitor all registered users
              </p>
            </div>

            <ExportButton />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:max-w-[800px] xl:max-w-full">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-sm flex justify-start flex-col gap-1"
              >
                {" "}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}
                >
                  <Image
                    src={item.src}
                    width={20}
                    height={20}
                    alt={item.title + " icon"}
                  />
                </div>
                <h3 className="text-2xl font-semibold">{item.value}</h3>
                <p className="text-sm text-gray-500">{item.title}</p>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl p-4">
            {/* Search + Tabs */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between mb-6">
              <div className="flex items-center gap-2 border rounded-xl px-4 h-11 w-full xl:max-w-md">
                <Search size={18} />
                <input
                  className="w-full outline-none text-sm"
                  placeholder="Search users..."
                />
              </div>

              <div className="flex flex-wrap rounded-xl bg-gray-100 p-1 no-scrollbar">
                {["All", "Active", "Blocked", "Inactive"].map((tab, i) => (
                  <button
                    key={i}
                    className={`px-5 py-2 text-sm rounded-lg whitespace-nowrap ${
                      i === 0 ? "bg-violet-700 text-white" : "text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-sm">
                    <th className="p-4">User ID</th>
                    <th>User Info</th>
                    <th>Wallet</th>
                    <th>Sessions</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Contact</th>
                    <th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item, i) => {
                    const statusStyle =
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700";

                    return (
                      <tr key={i} className="border-b text-sm">
                        <td className="p-4">USR001</td>
                        <td>Rahul Kumar</td>

                        <td className="text-green-600 font-medium">₹2,500</td>

                        <td>
                          <p>12</p>
                          <p className="text-gray-500 text-xs">₹8,500 spent</p>
                        </td>

                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${statusStyle}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td>15 Jan 2026</td>

                        <td className="py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 break-all text-xs">
                              <Mail size={14} />
                              rahul.k@email.com
                            </div>

                            <div className="flex items-center gap-1 break-all text-xs">
                              <Phone size={14} />
                              +91 9876543210
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="flex justify-end gap-2 pr-4">
                            <Link href="/Admin/UserManagement/UserPopUp">
                              <Eye
                                size={18}
                                className="text-violet-700 cursor-pointer"
                              />
                            </Link>
                            <MoreVertical
                              size={18}
                              className="cursor-pointer"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button className="w-10 h-10 rounded-md border flex items-center justify-center">
                <ChevronLeft size={18} />
              </button>

              <p className="text-sm md:text-base">Page 1 of 10</p>

              <button className="w-10 h-10 rounded-md border flex items-center justify-center">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
