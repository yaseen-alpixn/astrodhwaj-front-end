"use client";

import { Eye, MoreVertical, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { adminApi, formatDate, qs, titleCase, type ApiMeta } from "../api";

type ContentItem = {
  id: string;
  title: string;
  content_type: string;
  category?: string;
  views?: number;
  status: string;
  created_at?: string;
};

type Props = {
  page?: number;
  search?: string;
  status?: string;
  onMetaChange?: (meta: ApiMeta | null) => void;
};

export default function ContentTable({ page = 1, search = "", status = "All", onMetaChange }: Props) {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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

  useEffect(() => {
    adminApi<ContentItem[]>(`/admin/content${qs({ page, limit: 9, search, status })}`)
      .then((response) => {
        setData(response.data || []);
        onMetaChange?.(response.meta || null);
        setError("");
      })
      .catch((err) => {
        setData([]);
        onMetaChange?.(null);
        setError(err instanceof Error ? err.message : "Unable to load content");
      })
      .finally(() => setLoading(false));
  }, [page, search, status, onMetaChange]);

  const handlePublish = (id: string) => {
    adminApi(`/admin/content/${id}/publish`, { method: "PATCH" })
      .then(() => {
        setData((current) => current.map((item) => item.id === id ? { ...item, status: "published" } : item));
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to publish content"));
  };

  const handleUnpublish = (id: string) => {
    adminApi(`/admin/content/${id}/unpublish`, { method: "PATCH" })
      .then(() => {
        setData((current) => current.map((item) => item.id === id ? { ...item, status: "draft" } : item));
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to unpublish content"));
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setError("Select Delete Item again to confirm deletion.");
      return;
    }
    adminApi(`/admin/content/${id}`, { method: "DELETE" })
      .then(() => {
        setData((current) => current.filter((item) => item.id !== id));
        setConfirmDeleteId(null);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to delete content"));
  };

  const statusStyles: Record<string, string> = {
    published: "bg-green-100 text-green-600",
    paused: "bg-red-100 text-red-600",
    draft: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm" ref={dropdownRef}>
      <table className="min-w-[1200px] w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">Title</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Type</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Category</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Views</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Status</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Date</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && <tr><td className="p-6 text-center text-gray-500" colSpan={7}>Loading...</td></tr>}
          {!loading && error && <tr><td className="p-6 text-center text-red-500" colSpan={7}>{error}</td></tr>}
          {!loading && !error && data.length === 0 && <tr><td className="p-6 text-center text-gray-500" colSpan={7}>No content found</td></tr>}
          {data.map((item, i) => (
            <tr key={item.id || i} className="border-b last:border-none text-sm md:text-[14px]">
              <td className="p-3 whitespace-nowrap">{item.title}</td>
              <td className="p-3 text-center">
                <span className="px-3 py-1 rounded-full bg-[#4898E1]/10 text-[#4898E1] text-xs md:text-sm whitespace-nowrap">{titleCase(item.content_type)}</span>
              </td>
              <td className="p-3">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                  <Tag size={16} />
                  {item.category || "-"}
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                  <Link href="/Admin/ContentManagement/EditContent"><Eye size={16} /></Link>
                  {item.views || 0}
                </div>
              </td>
              <td className="p-3 text-center">
                <span className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${statusStyles[item.status] || statusStyles.draft}`}>
                  {titleCase(item.status)}
                </span>
              </td>
              <td className="p-3 text-center whitespace-nowrap">{formatDate(item.created_at)}</td>
              <td className="p-3 relative">
                <div className="flex justify-center items-center gap-3">
                  <Link href="/Admin/ContentManagement/EditContent">
                    <Eye size={18} className="text-[#4898E1] cursor-pointer" />
                  </Link>
                  <MoreVertical
                    size={18}
                    className="cursor-pointer"
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                  />

                  {activeDropdown === item.id && (
                    <div className="absolute right-4 mt-6 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40 border border-gray-100">
                      <div className="py-1">
                        {item.status !== "published" ? (
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              handlePublish(item.id);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Publish Item
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              handleUnpublish(item.id);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Send to Draft
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            handleDelete(item.id);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                            {confirmDeleteId === item.id ? "Confirm Delete" : "Delete Item"}
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
