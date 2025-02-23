"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

/* Reuse your existing Loader & Alert components */
import Loader from "@/components/common/Loader";
import Alert from "@/components/Alert";

interface Notice {
  _id: string;
  title: string;
  created_at: string; // or Date
}

const PAGE_LIMIT = 5; // default how many per page

const NoticePage: React.FC = () => {
  // -------------- State --------------
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");

  // For adding/editing a notice
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loader states
  const [loading, setLoading] = useState(false);

  // Alert states
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // -------------- useEffect --------------
  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  // -------------- Handlers --------------
  // Fetch paginated notices
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/notice?page=${currentPage}&limit=${PAGE_LIMIT}`
      );
      if (res.data.success) {
        setNotices(res.data.data);
        setTotalPages(res.data.totalPages);
      } else {
        showAlertMessage("error", res.data.message || "Error fetching notices");
      }
    } catch (err: any) {
      showAlertMessage("error", "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  // Create or update a notice
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      showAlertMessage("error", "Title is required");
      return;
    }

    // Are we editing or creating?
    if (isEditing && editId) {
      // Update existing
      await updateNotice(editId, title);
    } else {
      // Create new
      await createNotice(title);
    }

    // Clear form
    setTitle("");
    setIsEditing(false);
    setEditId(null);
  };

  // CREATE notice
  const createNotice = async (noticeTitle: string) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/notice`,
        { title: noticeTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        showAlertMessage("success", "Notice created successfully!");
        // Re-fetch or push new item into local state
        fetchNotices();
      } else {
        showAlertMessage("error", res.data.message || "Error creating notice");
      }
    } catch (err: any) {
      showAlertMessage("error", err.response?.data?.message || "Error creating notice");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE notice
  const updateNotice = async (id: string, noticeTitle: string) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/notice/${id}`,
        { title: noticeTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        showAlertMessage("success", "Notice updated successfully!");
        fetchNotices();
      } else {
        showAlertMessage("error", res.data.message || "Error updating notice");
      }
    } catch (err: any) {
      showAlertMessage("error", err.response?.data?.message || "Error updating notice");
    } finally {
      setLoading(false);
    }
  };

  // DELETE notice
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/notice/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        showAlertMessage("success", "Notice deleted successfully!");
        fetchNotices();
      } else {
        showAlertMessage("error", res.data.message || "Error deleting notice");
      }
    } catch (err: any) {
      showAlertMessage("error", err.response?.data?.message || "Error deleting notice");
    } finally {
      setLoading(false);
    }
  };

  // Switch to edit mode
  const handleEdit = (notice: Notice) => {
    setTitle(notice.title);
    setIsEditing(true);
    setEditId(notice._id);
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

  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // -------------- Render --------------
  // If globally loading, show loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-4">
      {/* Alert */}
      {showAlert && alertMessage && (
        <Alert type={alertType} message={alertMessage} onClose={handleCloseAlert} />
      )}

      {/* Form */}
      <div className="max-w-md mx-auto mb-8 rounded-md border border-gray-300 bg-white p-6 shadow-sm dark:bg-[#1B1B24]">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
          {isEditing ? "Update Notice" : "Create Notice"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-black dark:text-white">
              Notice Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              placeholder="Enter notice title"
            />
          </div>

          <button
          type="submit"
          disabled={isEditing && !editId}
          className="disabled:bg-gray-400 disabled:hover:bg-gray-400 inline-flex items-center gap-2 rounded bg-primary px-5 py-2 font-medium text-white transition-colors hover:bg-opacity-90"
        >
          {/* If uploading, show spinner or text; otherwise show normal text */}
          {isEditing ? (
            <div className="flex items-center gap-2">
              {/* <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div> */}
              <span>Update</span>
            </div>
          ) : (
            "Create"
          )}
        </button>
        </form>
      </div>

      {/* Notices List */}
      <div className="max-w-2xl mx-auto">
        <h3 className="mb-4 text-lg font-medium text-black dark:text-white">All Notices</h3>
        {notices.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">No notices found.</p>
        )}

        <ul className="space-y-4">
          {notices.map((notice) => (
            <li
              key={notice._id}
              className="flex items-center justify-between rounded-md border border-gray-200 p-4 dark:border-gray-700 dark:bg-[#2A2A35]"
            >
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  {notice.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {new Date(notice.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(notice)}
                  className="rounded bg-yellow px-2 py-1 text-xs font-medium text-white hover:bg-yellow-400"
                >
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(notice._id)}
                  className="rounded bg-danger px-2 py-1 text-xs font-medium text-white hover:bg-red-400"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-center space-x-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400 disabled:bg-gray-200"
          >
            Prev
          </button>
          <span className="text-sm dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400 disabled:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoticePage;
