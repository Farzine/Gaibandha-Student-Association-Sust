"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import ClickOutside from "@/components/Dashboard-components/ClickOutside";
import Cookies from "js-cookie";
import LinearProgress from "@mui/material/LinearProgress";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
}

interface NotificationType {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
  // add other fields as needed
}

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // Fetch notifications from your backend
  useEffect(() => {
    const fetchNotifications = async (userId: string) => {
      try {
        setLoading(true);
        setShowError(false);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/notification/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch notifications");
        }

        // If successful:
        if (data.success) {
          setNotifications(data.notifications);
          // Determine how many notifications are unread
          const unread = data.notifications.filter(
            (n: NotificationType) => !n.read
          ).length;
          setUnreadCount(unread);
        }
      } catch (error: any) {
        console.error("Error fetching notifications:", error);
        setErrorMessage(error.message || "Error fetching notifications");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        fetchNotifications(decodedToken.id);
      } catch (error: any) {
        console.error("Error decoding token:", error);
        setErrorMessage("Error decoding token");
        setShowError(true);
        setLoading(false);
      }
    } else {
      setErrorMessage("No token found");
      setShowError(true);
      setLoading(false);
    }
  }, []);

  // Mark a single notification as read (PATCH request) — only if unread
  const markAsRead = async (notificationId: string, isRead: boolean) => {
    // If it's already read, do nothing
    if (isRead) return;

    try {
      setLoading(true);
      setShowError(false);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/notification/mark-as-read/${notificationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark notification as read");
      }

      if (data.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, read: true } : n
          )
        );

        // Recalculate unread count based on newly updated notifications
        setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      setErrorMessage(error.message || "Error marking notifications as read");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Toggle the dropdown
  const handleBellClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <button
          onClick={handleBellClick}
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] 
                     border-stroke bg-gray hover:text-primary 
                     dark:border-strokedark dark:bg-meta-4 dark:text-white"
          aria-label="Notifications"
        >
          {/* If we have any unread notifications, show the red dot + ping */}
          {unreadCount > 0 && (
            <>
              <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1" />
              <span className="absolute -top-0.5 right-0 -z-1 inline-flex h-2 w-2 animate-ping rounded-full bg-meta-1 opacity-75" />
            </>
          )}
          <FaBell className="text-sm" />
        </button>

        {dropdownOpen && (
          <div
            className={`absolute -right-20 mt-2.5 max-h-96 w-72 sm:w-80
                        flex flex-col overflow-hidden rounded-sm border border-stroke bg-white 
                        shadow-default dark:border-strokedark dark:bg-boxdark`}
          >
            <div className="flex items-center justify-between px-4.5 py-3">
              <h5 className="text-sm font-medium text-bodydark2 dark:text-bodydark">
                Notifications
              </h5>
              <p className="text-xs font-medium">
                {unreadCount === 0 ? "No Unread" : `${unreadCount} Unread`}
              </p>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="px-4.5 py-3">
                <LinearProgress />
              </div>
            )}

            {/* Error Message */}
            {showError && !loading && (
              <div className="border-t border-stroke px-4.5 py-3 dark:border-strokedark">
                <p className="text-sm text-red-500">{errorMessage}</p>
              </div>
            )}

            {/* Notification List */}
            {!loading && !showError && (
              <ul className="flex flex-col overflow-y-auto">
                {/* If no notifications */}
                {notifications.length === 0 && (
                  <li>
                    <div className="border-t border-stroke px-4.5 py-3 dark:border-strokedark">
                      <p className="text-sm text-black dark:text-white">
                        No notifications yet.
                      </p>
                    </div>
                  </li>
                )}

                {/* Map notifications */}
                {notifications.map((notification) => (
                  <li key={notification._id}>
                    <div
                      onClick={() =>
                        markAsRead(notification._id, notification.read)
                      }
                      className={`cursor-pointer flex flex-col gap-1 border-t border-stroke px-4.5 py-3 
                                 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 
                                 ${
                                   !notification.read
                                     ? "bg-gray-light dark:bg-meta-3"
                                     : ""
                                 }`}
                    >
                      <p className="text-sm text-black dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-bodydark2 dark:text-bodydark1">
                        {formatDate(notification.createdAt)} {new Date(notification.createdAt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;


