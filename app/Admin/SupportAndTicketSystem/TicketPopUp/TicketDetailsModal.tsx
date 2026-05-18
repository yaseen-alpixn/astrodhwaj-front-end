"use client";

import { X, Paperclip } from "lucide-react";

export default function TicketDetailsModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* MODAL */}
      <div className="flex max-h-[90vh] w-[min(1000px,95vw)] flex-col overflow-hidden rounded-xl bg-white font-[DM_Sans]">
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">TKT001</h2>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
              Open
            </span>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* ISSUE */}
          <div className="rounded-xl bg-gray-100 p-4">
            <p className="font-semibold text-lg">
              Payment Not Reflected in Wallet
            </p>
            <p className="text-sm text-gray-600">
              I Made A Payment Of ₹1000 But It Is Not Showing In My Wallet
              Balance.
            </p>
          </div>

          {/* USER + META */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-gray-500">USER DETAILS:</p>
              <p className="font-medium">Rahul Kumar</p>
              <p className="text-gray-600">rahul.k@email.com</p>
            </div>

            <div>
              <p className="text-gray-500">TICKET META:</p>
              <p>
                Priority: <span className="text-red-600">High</span>
              </p>
              <p>Category: Payment</p>
              <p>Assigned To: Support Team</p>
              <p>Created: 26 Mar 2026, 2:30 PM</p>
            </div>
          </div>

          {/* CHAT */}
          <div>
            <h3 className="mb-3 font-semibold text-lg">Conversation History</h3>

            <div className="space-y-4">
              {/* USER MESSAGE */}
              <div className="max-w-[70%] rounded-xl bg-purple-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm">
                    R
                  </div>
                  <div>
                    <p className="font-medium text-sm">Rahul Kumar</p>
                    <p className="text-xs text-gray-500">
                      26 Mar 2026, 3:15 PM
                    </p>
                  </div>
                </div>
                <p className="text-sm">
                  I Made A Payment Of ₹1000 But It Is Not Showing In My Wallet
                  Balance.
                </p>
              </div>

              {/* ADMIN MESSAGE */}
              <div className="ml-auto max-w-[70%] rounded-xl bg-blue-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-sm">Support Team</p>
                    <p className="text-xs text-gray-500">
                      26 Mar 2026, 3:15 PM
                    </p>
                  </div>
                </div>
                <p className="text-sm">
                  Thank You For Reaching Out. We Are Looking Into This Issue And
                  Will Update You Shortly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (STICKY INPUT) */}
        <div className="sticky bottom-0 border-t bg-white p-4 space-y-3">
          <textarea
            placeholder="Type message here..."
            className="w-full rounded-lg border px-3 py-2"
          />

          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-sm text-gray-600">
              <Paperclip size={16} />
              Attach File
            </button>

            <div className="flex gap-3">
              <select className="rounded-md border px-3 py-2 text-sm">
                <option>Mark as In Progress</option>
                <option>Resolved</option>
              </select>

              <button className="rounded-md bg-purple-700 px-5 py-2 text-white">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
