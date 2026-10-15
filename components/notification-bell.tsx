"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/providers/NotificationProvider";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { CircleAlertIcon } from 'lucide-react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { Card, CardHeader, CardTitle } from "./ui/card";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const {
    notifications,
    unreadCount,
    markAsRead,
    refreshNotifications
  } = useNotifications();

  useEffect(()=>{
    refreshNotifications()
  },[refreshNotifications])
  

  const handleNotificationClick = async (
    notification: (typeof notifications)[number]
  ) => {
    try {
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }
    } catch (error) {
      console.error("Unable to mark notification as read", error);
    } finally {
      setIsOpen(false);
      router.push(`/tasks/${notification.taskId}`);
    }
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant={'outline'}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Notifications"
        className="relative rounded-lg border p-3 cursor-pointer">
        <Bell/>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <Card className="absolute right-0 z-50 w-80 rounded-xs border shadow-lg">
          <CardHeader>
            <CardTitle className="border-b font-semibold">Notifications</CardTitle>
          </CardHeader>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <Alert variant={'destructive'} key={notification.id}>
                <CircleAlertIcon  className="text-success" />
                <AlertTitle>Notification! All good</AlertTitle>
                <AlertDescription>
                  {notification.message}
                </AlertDescription>
                <AlertAction onClick={() => void handleNotificationClick(notification)}>Action</AlertAction>
              </Alert>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}