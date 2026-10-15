"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { socket } from "@/lib/socket";
import { Notification } from "@/types/notification.types";
import api from "@/lib/axios";
import { useSession } from "./SessionProvider";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);
    const { user } = useSession()
    const userId = user?.id;
    console.log("USERID:", user?.id)

  const refreshNotifications = useCallback(async () => {
    const response = await api.get(`/api/notifications/${userId}`)
    const result = await response.data?.data;

    // Adapt this line to your APIResponse structure.
    const data: Notification[] = result;

    setNotifications(data);
  }, [userId]);

  const markAsRead = useCallback(async (id: string) => {

    const data = { userId, id }
    const response = await api.put("/api/notifications",{data});

    console.log(response)

    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, [userId]);

  useEffect(() => {
    const handleNewNotification = (
      notification: Notification
    ) => {
      setNotifications((previous) => {
        if (previous.some((item) => item.id === notification.id)) {
          return previous;
        }

        return [notification, ...previous];
      });
    };

    const handleConnect = () => {
      void refreshNotifications().catch(console.error);
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("connect", handleConnect);

    socket.connect();

    void refreshNotifications().catch(console.error);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [refreshNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}