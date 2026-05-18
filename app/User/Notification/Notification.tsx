"use client";

import { useState } from "react";
import { Gift, ClipboardList, Star, Trash2 } from "lucide-react";

interface Notification {
  id: number;
  type: "offer" | "session" | "feature";
  title: string;
  description: string;
  date: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "offer",
    title: "Welcome Offer",
    description: "Get 20% Off On Your First Consultation!",
    date: "2026-03-23",
    isRead: false,
  },
  {
    id: 2,
    type: "session",
    title: "Session Completed",
    description: "Your Session With Astrologer Priya Has Been Completed",
    date: "2026-03-23",
    isRead: true,
  },
  {
    id: 3,
    type: "feature",
    title: "New Feature",
    description: "Kundli Matching Is Now Available!",
    date: "2026-03-23",
    isRead: true,
  },
  {
    id: 4,
    type: "offer",
    title: "Welcome Offer",
    description: "Get 20% Off On Your First Consultation!",
    date: "2026-03-23",
    isRead: false,
  },
  {
    id: 5,
    type: "feature",
    title: "New Feature",
    description: "Kundli Matching Is Now Available!",
    date: "2026-03-23",
    isRead: true,
  },
];

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "offer":
      return <Gift className="h-6 w-6 text-amber-600" />;
    case "session":
      return <ClipboardList className="h-6 w-6 text-gray-500" />;
    case "feature":
      return <Star className="h-6 w-6 text-amber-500" />;
  }
};

const getIconBg = (type: Notification["type"]) => {
  switch (type) {
    case "offer":
      return "bg-amber-100";
    case "session":
      return "bg-gray-100";
    case "feature":
      return "bg-amber-50";
  }
};

const getBorderColor = (type: Notification["type"]) => {
  switch (type) {
    case "offer":
      return "border-l-amber-400";
    case "session":
      return "border-l-gray-300";
    case "feature":
      return "border-l-gray-300";
  }
};

export default function Notification() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md">
        {/* Action Buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={markAllAsRead}
            className="flex-1 rounded-full bg-amber-400 px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-amber-500"
          >
            Mark All As Read
          </button>
          <button
            onClick={clearAll}
            className="flex-1 rounded-full border-2 border-red-500 bg-white px-6 py-3 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            Clear All
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative rounded-2xl border-l-4 bg-white p-4 shadow-sm ${getBorderColor(notification.type)}`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${getIconBg(notification.type)}`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="text-[13px] font-normal text-gray-600 leading-[22px]">
                      {notification.description}
                    </p>
                    <p className="mt-1 text-[12px] font-normal text-gray-400">
                      {notification.date}
                    </p>
                  </div>

                  {/* Unread Indicator & Delete */}
                  <div className="flex flex-col items-end justify-between">
                    {!notification.isRead && (
                      <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    )}
                    {notification.type === "offer" && (
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
