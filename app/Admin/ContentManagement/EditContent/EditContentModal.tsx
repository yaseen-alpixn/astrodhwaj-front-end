"use client";

import { X } from "lucide-react";

export default function EditContentModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* MODAL BOX (SCROLLABLE) */}
      <div className="max-h-[90vh] w-[min(700px,95vw)] overflow-y-auto rounded-xl bg-white font-[DM_Sans]">
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-lg font-semibold">Edit Content</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FORM */}
        <div className="p-5 space-y-4">
          {/* ROW 1 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-gray-600">Content Type</label>
              <select className="mt-1 w-full rounded-lg border px-3 py-2">
                <option>Horoscope</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Category</label>
              <input
                value="Horoscope"
                readOnly
                className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-100"
              />
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-600">Title</label>
            <input
              defaultValue="Daily Horoscope – Aries"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="text-sm text-gray-600">Content</label>
            <textarea
              rows={4}
              defaultValue="Today brings opportunities for Aries natives. Your energy levels are high and you may find success in new ventures. Financial prospects look favorable, but exercise caution in personal relationships."
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select className="mt-1 w-full rounded-lg border px-3 py-2">
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>

          {/* TAGS */}
          <div>
            <label className="text-sm text-gray-600">
              Tags (comma separated)
            </label>
            <input
              defaultValue="Aries, Daily, Zodiac"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-center gap-4 pt-4">
            <button className="rounded-md bg-[#4898E1] px-6 py-2 text-white">
              Update
            </button>
            <button onClick={onClose} className="rounded-md border px-6 py-2">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
