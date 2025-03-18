import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { MessageType } from "./types";

interface MessagesListProps {
  onEdit: (message: MessageType) => void;
  refreshTrigger: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({
  onEdit,
  refreshTrigger,
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const token = Cookies.get("token");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/message`,
      );
      setMessages(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/message/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessages(messages.filter((message) => message._id !== id));
    } catch (err) {
      console.error(err);
      setDeleteLoading(null);
    }
  };

  const toggleMessageExpand = (id: string) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  return (
    <div className="mt-8 rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-lg dark:border-[#374151] dark:bg-[#1f2937]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center text-2xl font-bold text-[#1f2937] dark:text-white">
          <span className="mr-3 inline-block h-8 w-1 rounded bg-primary"></span>
          Messages List
        </h2>
        <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-sm font-medium text-[#4b5563] dark:bg-[#374151] dark:text-[#d1d5db]">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] dark:border-[#374151]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 h-16 w-16 text-[#d1d5db] dark:text-[#4b5563]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium text-[#6b7280] dark:text-[#9ca3af]">
                No messages found
              </p>
              <p className="mt-1 text-sm text-[#9ca3af] dark:text-[#6b7280]">
                Messages you create will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e5e7eb] dark:divide-[#374151]">
                <thead className="bg-[#f9fafb] dark:bg-[#374151]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#d1d5db]">
                      Name
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#d1d5db]">
                      Designation
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#d1d5db]">
                      Message
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#d1d5db]">
                      Image
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:text-[#d1d5db]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb] bg-white dark:divide-[#374151] dark:bg-[#1f2937]">
                  {messages.map((message) => (
                    <tr
                      key={message._id}
                      className="transition-colors duration-150 hover:bg-[#f9fafb] dark:hover:bg-[#374151]"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-[#111827] dark:text-white">
                          {message.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-[#6b7280] dark:text-[#d1d5db]">
                          {message.designation}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm text-[#6b7280] dark:text-[#d1d5db] ${expandedMessage === message._id ? "" : "line-clamp-2"}`}
                          dangerouslySetInnerHTML={{ __html: message.message }}
                          onClick={() => toggleMessageExpand(message._id)}
                        ></div>
                        {message.message.length > 100 && (
                          <button
                            onClick={() => toggleMessageExpand(message._id)}
                            className="mt-1 text-xs text-primary transition-colors hover:text-black dark:text-[#60a5fa] dark:hover:text-[#93c5fd]"
                          >
                            {expandedMessage === message._id
                              ? "Show less"
                              : "Show more"}
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {message.path ? (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[#e5e7eb] dark:border-[#4b5563]">
                            <img
                              src={message.path}
                              alt={message.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#9ca3af] dark:bg-[#374151] dark:text-[#6b7280]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEdit(message)}
                            className="inline-flex items-center rounded-md bg-[#eff6ff] px-3 py-1.5 text-[#1d4ed8] transition-colors duration-150 hover:bg-[#dbeafe] dark:bg-[#1e3a8a] dark:text-[#bfdbfe] dark:hover:bg-[#1e40af]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1.5 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(message._id)}
                            className="inline-flex items-center rounded-md bg-[#fef2f2] px-3 py-1.5 text-[#b91c1c] transition-colors duration-150 hover:bg-[#fee2e2] dark:bg-[#7f1d1d] dark:text-[#fecaca] dark:hover:bg-[#991b1b]"
                            disabled={loading}
                          >
                            {deleteLoading == message._id ? (
                              <>
                                <svg
                                  className="mr-1.5 h-4 w-4 animate-spin"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-1.5 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesList;
