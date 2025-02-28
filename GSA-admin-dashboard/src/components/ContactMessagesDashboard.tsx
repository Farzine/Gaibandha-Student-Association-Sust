"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "@/components/common/Loader";
import Alert from "@/components/Alert";
import {
  FiMail,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiFilter,
  FiX,
} from "react-icons/fi";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
  read: boolean;
}

type FilterStatus = "all" | "read" | "unread";

const PAGE_LIMIT = 5;

const ContactMessagesDashboard: React.FC = () => {
  // -------------- State --------------
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
  });
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;

  // -------------- useEffect --------------
  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  useEffect(() => {
    // Apply filters when messages or filter status changes
    filterMessages();
  }, [messages, filterStatus]);

  // -------------- Handlers --------------
  // Calculate stats from messages
  const calculateStats = (messagesData: ContactMessage[]) => {
    const readCount = messagesData.filter((msg) => msg.read).length;
    setStats({
      total: messagesData.length,
      read: readCount,
      unread: messagesData.length - readCount,
    });
  };

  // Filter messages based on selected status
  const filterMessages = () => {
    let filtered = [...messages];

    if (filterStatus === "read") {
      filtered = filtered.filter((msg) => msg.read);
    } else if (filterStatus === "unread") {
      filtered = filtered.filter((msg) => !msg.read);
    }

    // Sort messages with unread first, then by newest date
    filtered.sort((a, b) => {
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredMessages(filtered);
    setTotalPages(Math.ceil(filtered.length / PAGE_LIMIT));
    if (
      currentPage > Math.ceil(filtered.length / PAGE_LIMIT) &&
      Math.ceil(filtered.length / PAGE_LIMIT) > 0
    ) {
      setCurrentPage(1);
    }
  };

  // Fetch paginated contact messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const res = await axios.get(`${baseUrl}/sendMessage/getAll-contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        // Assuming API doesn't provide read status, simulate it based on status value.
        const messagesWithReadStatus = res.data.data.map((msg: any) => ({
          ...msg,
          read: msg.status === "read" || msg.status === "resolved",
        }));
        setMessages(messagesWithReadStatus);
        calculateStats(messagesWithReadStatus);
      } else {
        showAlertMessage(
          "error",
          res.data.message || "Error fetching messages"
        );
      }
    } catch (err: any) {
      showAlertMessage(
        "error",
        err.response?.data?.message || "Failed to fetch messages"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update message read status
  const toggleReadStatus = async (id: string, currentReadStatus: boolean) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const newStatus = currentReadStatus ? "unread" : "read";

      const res = await axios.put(
        `${baseUrl}/sendMessage/contact/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const updatedMessages = messages.map((msg) =>
          msg._id === id
            ? { ...msg, read: !currentReadStatus, status: newStatus }
            : msg
        );
        setMessages(updatedMessages);
        calculateStats(updatedMessages);
        showAlertMessage("success", `Message marked as ${newStatus}`);
      } else {
        showAlertMessage(
          "error",
          res.data.message || "Error updating message status"
        );
      }
    } catch (err: any) {
      showAlertMessage(
        "error",
        err.response?.data?.message || "Error updating message status"
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE a contact message
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const res = await axios.delete(`${baseUrl}/sendMessage/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        showAlertMessage("success", "Message deleted successfully!");
        fetchMessages();
      } else {
        showAlertMessage(
          "error",
          res.data.message || "Error deleting message"
        );
      }
    } catch (err: any) {
      showAlertMessage(
        "error",
        err.response?.data?.message || "Error deleting message"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper: Show alert
  const showAlertMessage = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  // Helper: Close alert
  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * PAGE_LIMIT;
    const endIndex = startIndex + PAGE_LIMIT;
    return filteredMessages.slice(startIndex, endIndex);
  };

  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // -------------- Render --------------
  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9fafb] dark:bg-[#111827]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-[#f9fafb] dark:bg-[#1A222C]">
      {showAlert && alertMessage && (
        <div className="fixed top-4 right-4 z-50 w-full max-w-md">
          <Alert
            type={alertType}
            message={alertMessage}
            onClose={handleCloseAlert}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md dark:bg-[#1f2937] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[#1f2937] dark:border-[#1f2937]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1f2937] dark:text-white">
                  Contact Messages
                </h3>
                <p className="text-sm text-[#4b5563] dark:text-[#d1d5db] mt-1">
                  Manage and respond to website inquiries
                </p>
              </div>
              {/* Filter tabs */}
              <div className="flex space-x-1 bg-[#f3f4f6] dark:bg-[#374151] rounded-lg p-1">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    filterStatus === "all"
                      ? "bg-white dark:bg-[#4b5563] text-[#1f2937] dark:text-white shadow-sm"
                      : "text-[#4b5563] dark:text-[#d1d5db] hover:text[#1f2937] dark:hover:text-white"
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilterStatus("unread")}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    filterStatus === "unread"
                      ? "bg-white dark:bg-[#4b5563] text-[#1f2937] dark:text-white shadow-sm"
                      : "text-[#4b5563] dark:text-[#d1d5db] hover:text-[#1f2937] dark:hover:text-white"
                  }`}
                >
                  Unread ({stats.unread})
                </button>
                <button
                  onClick={() => setFilterStatus("read")}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    filterStatus === "read"
                      ? "bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-white shadow-sm"
                      : "text-[#4b5563]0 dark:text-[#d1d5db] hover:text-[#1f2937] dark:hover:text-white"
                  }`}
                >
                  Read ({stats.read})
                </button>
              </div>
            </div>
          </div>

          {/* Mobile stats */}
          <div className="grid grid-cols-3 gap-1 p-4 md:hidden bg-[#f9fafb] dark:bg-[#1f2937]">
            <div className="bg-white dark:bg-dark rounded-md p-3 text-center">
              <span className="text-xs text-[#6b7280] dark:text-[#9ca3af]">Total</span>
              <p className="text-lg font-semibold text-[#1f2937] dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="bg-white dark:bg-dark rounded-md p-3 text-center">
              <span className="text-xs text-[#6b7280] dark:text-[#9ca3af]">Unread</span>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {stats.unread}
              </p>
            </div>
            <div className="bg-white dark:bg-dark rounded-md p-3 text-center">
              <span className="text-xs text-[#6b7280] dark:text-[#9ca3af]">Read</span>
              <p className="text-lg font-semibold text-[#16a34a] dark:text-[#4ade80]">
                {stats.read}
              </p>
            </div>
          </div>

          {/* Table */}
          {getCurrentPageItems().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] dark:text-bodydark uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] dark:text-bodydark uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] dark:text-bodydark uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] dark:text-bodydark uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6b7280] dark:text-bodydark uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[gray-200] dark:divide-[#374151] dark:bg-dark">
                  {getCurrentPageItems().map((msg) => (
                    <tr
                      key={msg._id}
                      className={`hover:bg-[#f9fafb] dark:hover:bg-[#374151] transition-colors ${
                        !msg.read ? "bg-[#eff6ff] dark:bg-[#1e3a8a]" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              !msg.read ? "bg-[#3b82f6]" : "bg-[#d1d5db] dark:bg-[#4b5563]"
                            }`}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-[#111827] dark:text-white">
                              {msg.name}
                            </div>
                            <div className="text-sm text-[#6b7280] dark:text-[#d1d5db]">
                              {msg.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                        <div
                          onClick={() => setSelectedMessage(msg)}
                          className={`text-sm text-[#111827] dark:text-[#f3f4f6] line-clamp-2 cursor-pointer ${
                            !msg.read ? "font-medium" : ""
                          }`}
                          title="Click to view full message"
                        >
                          {msg.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            !msg.read
                              ? "bg-[#dbeafe] text-[#1e40af] dark:bg-[#1e40af] dark:text-[#60a5fa]"
                              : "bg-[#dcfce7] text-[#166534] dark:bg-[#166534] dark:text-[#4ade80]"
                          }`}
                        >
                          {!msg.read ? "Unread" : "Read"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280] dark:text-[#d1d5db]">
                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleReadStatus(msg._id, msg.read)}
                            className={`p-2 rounded-lg ${
                              !msg.read
                                ? "text-[#2563eb] hover:text-[#1e3a8a] dark:text-[#60a5fa] dark:hover:text-[#93c5fd] hover:bg-[#93c5fd] dark:hover:bg-[#1e3a8a]"
                                : "text-[#4b5563] hover:text-[#111827] dark:text-[#9ca3af] dark:hover:text-[#d1d5db] hover:bg-[#f9fafb] dark:hover:bg-[#374151]"
                            }`}
                            title={msg.read ? "Mark as unread" : "Mark as read"}
                          >
                            {msg.read ? (
                              <FiEyeOff className="w-5 h-5" />
                            ) : (
                              <FiEye className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => window.location.href = `mailto:${msg.email}?subject=Re: Your Message`}
                            className="text-[#2563eb] hover:text-[#1e3a8a] dark:text-[#60a5fa] dark:hover:text-[#93c5fd] hover:bg-[#93c5fd] dark:hover:bg-[#1e3a8a]"
                            title="Reply"
                          >
                            <FiMail className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(msg._id)}
                            className="text-[#2563eb] hover:text-[#1e3a8a] dark:text-[#60a5fa] dark:hover:text-[#93c5fd] hover:bg-[#93c5fd] dark:hover:bg-[#1e3a8a]"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <FiFilter className="w-12 h-12 mx-auto text-[#9ca3af] dark:text-[#6b7280]" />
              <h3 className="mt-2 text-lg font-medium text-[#111827] dark:text-white">
                No messages found
              </h3>
              <p className="mt-1 text-sm text-[#6b7280] dark:text-[#9ca3af]">
                {filterStatus === "all"
                  ? "You don't have any messages yet"
                  : `No ${filterStatus} messages found`}
              </p>
              {filterStatus !== "all" && (
                <button
                  onClick={() => setFilterStatus("all")}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#2563eb] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6]"
                >
                  View all messages
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[#374151]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#374151] dark:text-[#d1d5db]">
                  Showing{" "}
                  <span className="font-medium">{getCurrentPageItems().length}</span>{" "}
                  of <span className="font-medium">{filteredMessages.length}</span>{" "}
                  messages
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 inline-flex items-center rounded-md bg-white dark:bg-[#374151] border border-[#d1d5db] dark:border-[#4b5563]shadow-sm text-sm font-medium text-[#374151] dark:text-[#e5e7eb] hover:bg-[#f9fafb] dark:hover:bg-[#4b5563] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 inline-flex items-center rounded-md bg-white dark:bg-[#374151] border border-[#d1d5db] dark:border-[#4b5563] shadow-sm text-sm font-medium text-[#374151] dark:text-[#e5e7eb] hover:bg-[#f9fafb] dark:hover:bg-[#4b5563] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#1f2937] rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="text-lg font-semibold text-[#1f2937] dark:text-white">
                Message from {selectedMessage.name}
              </h4>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-[#4b5563] dark:text-[#d1d5db] hover:text-[#1f2937] dark:hover:text-white"
                title="Close"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#374151] dark:text-[#d1d5db]">
                <span className="font-semibold">Email:</span> {selectedMessage.email}
              </p>
              <p className="mt-2 text-sm text-[#374151] dark:text-[#d1d5db] whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Your Message`}
                className="inline-flex items-center px-4 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-md hover:bg-[#1d4ed8]"
              >
                Reply
              </a>
              <button
                onClick={() => setSelectedMessage(null)}
                className="inline-flex items-center px-4 py-2 bg-[#d1d5db] text-[#1f2937] text-sm font-medium rounded-md hover:bg-[#9ca3af]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesDashboard;
