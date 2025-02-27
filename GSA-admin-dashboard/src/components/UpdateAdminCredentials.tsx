"use client";

import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

/* Reuse your existing Loader & Alert components */
import Loader from "@/components/common/Loader";
import Alert from "@/components/Alert";

export default function UpdateAdminCredentials() {
  // ------------ State ------------
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Alert states
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // ------------ Handlers ------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If both fields are blank, do nothing
    if (!newEmail && !newPassword) {
      showAlertMessage("error", "Please enter a new email or new password.");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("token"); // or however you store the JWT

      await axios.put(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/admin/update-email-password`,
        {
          newEmail,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlertMessage("success", "Email and password updated successfully!");
      setNewEmail("");
      setNewPassword("");
    } catch (err: any) {
      showAlertMessage(
        "error",
        err.response?.data?.message || "Failed to update credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Log out user
  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/admin/logout` // or POST if your route requires POST
      );
      showAlertMessage("success", "Logged out successfully!");
      // Optionally remove token or redirect
      Cookies.remove("token");
      // e.g. router.push("/login");
    } catch (err: any) {
      showAlertMessage(
        "error",
        err.response?.data?.message || "Failed to log out."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------ Helper: Show Alert ------------
  const showAlertMessage = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  // ------------ Render ------------
  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-20">
      {/* Alert */}
      {showAlert && alertMessage && (
        <Alert type={alertType} message={alertMessage} onClose={handleCloseAlert} />
      )}

      {/* Update Form */}
      <div className="mx-auto mb-8 max-w-md rounded-md border border-gray-300 bg-white p-6 shadow-sm dark:bg-[#1B1B24]">
        <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Update Email/Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-black dark:text-white">
              New Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-black dark:text-white">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-md border border-stroke p-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="disabled:bg-gray-400 disabled:hover:bg-gray-400 inline-flex items-center gap-2 rounded bg-primary px-5 py-2 font-medium text-white transition-colors hover:bg-opacity-90"
          >
           {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Updating...</span>
            </div>
          ) : (
            "Update"
          )}
          </button>
        </form>
      </div>
    </div>
  );
}
