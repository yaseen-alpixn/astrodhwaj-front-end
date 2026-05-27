"use client";

import { useEffect, useState } from "react";
import { Gift, ClipboardList, Star, Trash2 } from "lucide-react";
import { io } from "socket.io-client";
import { SOCKET_BASE, formatDate, getToken } from "@/services/api";
import {
  clearUserNotifications,
  deleteUserNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/services/user.service";

interface Notification extends NotificationItem {
  type: "offer" | "session" | "feature";
  description: string;
  date: string;
  isRead: boolean;
}

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

const toNotification = (item: NotificationItem): Notification => ({
  ...item,
  type: (["offer", "session", "feature"].includes(item.type) ? item.type : "feature") as Notification["type"],
  description: item.message,
  date: formatDate(item.created_at),
  isRead: item.is_read,
});

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getNotifications()
      .then((response) => {
        setNotifications((response.data || []).map(toNotification));
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_BASE, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: () => ({ token: getToken("user") }),
      reconnection: true,
    });
    socket.on("notification", (payload: NotificationItem) => {
      const incoming = toNotification({ ...payload, is_read: false });
      setNotifications((current) => {
        if (current.some((item) => item.id === incoming.id)) return current;
        return [incoming, ...current];
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const markAllAsRead = () => {
    markAllNotificationsRead().catch((err) => setError(err instanceof Error ? err.message : "Unable to mark all as read"));
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const clearAll = () => {
    clearUserNotifications().catch((err) => setError(err instanceof Error ? err.message : "Unable to clear notifications"));
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    deleteUserNotification(id).catch((err) => setError(err instanceof Error ? err.message : "Unable to delete notification"));
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const markOneAsRead = (id: string) => {
    markNotificationRead(id).catch(() => undefined);
    setNotifications((prev) => prev.map((notification) => notification.id === id ? { ...notification, isRead: true } : notification));
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
          {loading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Loading...
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white p-8 text-center text-red-500 shadow-sm">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.isRead && markOneAsRead(notification.id)}
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
                    <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-gray-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
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
