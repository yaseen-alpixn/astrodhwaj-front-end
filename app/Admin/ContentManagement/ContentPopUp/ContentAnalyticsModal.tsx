"use client";

import { X, Star } from "lucide-react";

export default function ContentAnalyticsModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* MODAL CONTAINER (SCROLLABLE) */}
      <div className="max-h-[90vh] w-[min(1000px,95vw)] overflow-y-auto rounded-xl bg-white font-[DM_Sans]">
        {/* HEADER (STICKY) */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-5">
          <h1 className="text-[24px] font-semibold">
            Content Analytics & Details
          </h1>
          <button>
            <X />
          </button>
        </div>

        <div className="p-5">
          {/* TOP CARD */}
          <div className="flex items-center justify-between rounded-xl bg-gray-100 p-4">
            <div>
              <p className="text-lg font-semibold">Daily Horoscope – Aries</p>
              <p className="text-sm text-gray-500">
                Dr. Priya Sharma • 26 Mar 2026 • 2 Min Read
              </p>
            </div>

            <div className="flex gap-2">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600">
                Horoscope
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                Published
              </span>
            </div>
          </div>

          {/* ENGAGEMENT */}
          <div className="mt-6 rounded-xl border p-4">
            <h2 className="mb-4 text-lg font-semibold">Engagement Breakdown</h2>

            {[
              {
                label: "Views",
                value: 2345,
                color: "bg-purple-600",
                width: "90%",
              },
              {
                label: "Likes",
                value: 234,
                color: "bg-green-600",
                width: "50%",
              },
              {
                label: "Comments",
                value: 45,
                color: "bg-yellow-500",
                width: "65%",
              },
              { label: "Share", value: 12, color: "bg-red-600", width: "35%" },
            ].map((item, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm">
                  <p>{item.label}</p>
                  <p>{item.value}</p>
                </div>

                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}

            {/* SCORE */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-yellow-100 to-purple-200 p-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500" />
                <p className="font-medium">Overall Engagement Score</p>
              </div>
              <p className="text-2xl font-bold text-purple-700">85%</p>
            </div>
          </div>

          {/* CONTENT PREVIEW */}
          <div className="mt-6 rounded-xl bg-gray-100 p-4">
            <h2 className="mb-2 text-lg font-semibold">Content Preview</h2>
            <p className="text-gray-600">
              Today brings opportunities for Aries natives. Your energy levels
              are high and you may find success in new ventures. Financial
              prospects look favorable, but exercise caution in personal
              relationships.
            </p>
          </div>

          {/* METADATA */}
          <div className="mt-6 rounded-xl border p-4">
            <h2 className="mb-4 text-lg font-semibold">Metadata</h2>

            <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
              {[
                { label: "Category", value: "Horoscope" },
                { label: "Read Time", value: "2 minute" },
                { label: "Published At", value: "26 Mar, 6:00 AM" },
                { label: "Last Modified", value: "26 Mar, 6:00 AM" },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-gray-500">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex justify-center gap-4">
            <button className="rounded-md bg-purple-700 px-6 py-2 text-white">
              Share Content
            </button>
            <button className="rounded-md border border-red-500 px-6 py-2 text-red-600">
              Delete Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
