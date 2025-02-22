// export default MemberRequest;
"use client";

import Profile from "@/components/Profile";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import LinearProgress from "@mui/material/LinearProgress";

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  session: string;
  bloodGroup?: string;
  presentAddress?: string;
  permanentAddress?: string;
  profession?: string;
  facebookId?: string;
  linkedinId?: string;
  about?: string;
  religiousStatus: string;
  profilePic?: string;
  schoolName?: string;
  collegeName?: string;
  member?: boolean;
  alumni?: boolean;
  phone?: string;
  designation?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const MemberRequest: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // NEW: success & error state for the alerts
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  // 1. Fetch all member requests on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/member-requests`
        );
        setRequests(res.data.data || []);
      } catch (err: any) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Helper to display success message
  const displaySuccess = (msg: string) => {
    setShowSuccess(true);
    setSuccessMessage(msg);
    // Also hide any previous error
    setShowError(false);
    setErrorMessage("");
  };

  // Helper to display error message(s)
  const displayError = (msg: string) => {
    setShowError(true);
    setErrorMessage(msg);
    // Also hide any previous success
    setShowSuccess(false);
    setSuccessMessage("");
  };

  // 2. Approve request
  const handleApprove = async (user: User) => {
    try {
      const token = Cookies.get("token"); // or however you store the token
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/handle-member-requests`,
        {
          userId: user._id,
          action: "approve",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // remove from UI
      setRequests((prev) => prev.filter((r) => r._id !== user._id));
      displaySuccess(`Member request for ${user.name} approved successfully!`);
    } catch (err: any) {
      if (err.response) {
        const { status, data } = err.response;
        // If it's a Mongoose validation error (e.g., invalid LinkedIn URL):
        if (status === 400 && data.errors) {
          // data.errors might be an object like { linkedinId: "...", facebookId: "..." }
          // Combine them into one error string:
          const combinedErrors = Object.values(data.errors).join("  |  ");
          displayError(combinedErrors);
        } else {
          // Other server-side error message or fallback
          displayError(data.message || "Failed to approve request.");
        }
      } else {
        // Possibly a network error
        displayError("Network error, please try again.");
      }
    }
  };

  // 3. Reject request
  const handleReject = async (user: User) => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/handle-member-requests`,
        {
          userId: user._id,
          action: "reject",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // remove from UI
      setRequests((prev) => prev.filter((r) => r._id !== user._id));
      displaySuccess(`Member request for ${user.name} rejected and user deleted!`);
    } catch (err: any) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.errors) {
          const combinedErrors = Object.values(data.errors).join("  |  ");
          displayError(combinedErrors);
        } else {
          displayError(data.message || "Failed to reject request.");
        }
      } else {
        displayError("Network error, please try again.");
      }
    }
  };

  // 4. Open modal with user details
  const openProfile = async (userId: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/member-request/${userId}`
      );
      setSelectedUser(res.data.data);
      setShowProfile(true);
    } catch (err) {
      displayError("Failed to fetch user details");
    }
  };

  // Loading/error UI
  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen">
      {/* Success & Error Alerts (top of the page) */}
      <div className="fixed top-8 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4">
        {/* Success Alerts */}
        {showSuccess && successMessage && (
          <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                  fill="white"
                  stroke="white"
                ></path>
              </svg>
            </div>
            <div className="w-full">
              <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399]">
                Success:
              </h5>
              <p className="text-base leading-relaxed text-body">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Error Alerts */}
        {showError && errorMessage && (
          <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                  fill="#ffffff"
                  stroke="#ffffff"
                ></path>
              </svg>
            </div>
            <div className="w-full">
              <h5 className="mb-3 font-semibold text-[#B45454]">Error:</h5>
              <ul>
                <li className="leading-relaxed text-[#CD5D5D]">
                  {errorMessage}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-lg font-bold text-black dark:text-white">
            Member Requests
          </h4>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-2 text-sm uppercase text-gray-600 dark:bg-meta-4 dark:text-gray-300">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="border-b border-stroke hover:bg-gray-50 dark:border-strokedark"
                >
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    <button
                      onClick={() => openProfile(req._id)}
                      className="text-primary hover:underline"
                    >
                      {req.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {req.department}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {req.email}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleApprove(req)}
                      className="inline-flex items-center rounded bg-green-600 px-3 py-1 transition-colors hover:bg-[#10B981] hover:text-white dark:text-white"
                    >
                      {/* Check Icon */}
                      <svg
                        className="mr-1 h-4 w-4 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.285 2.586l-11.285 11.293-4.285-4.293-2.707 2.707 7 7 14-14z" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req)}
                      className="ml-2 inline-flex items-center rounded bg-red-600 px-3 py-1 transition-colors hover:bg-[#f24949] hover:text-white dark:text-white"
                    >
                      {/* X Icon */}
                      <svg
                        className="mr-1 h-4 w-4 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.3 5.71l-4.6 4.6 4.6 4.59-2.12 2.12-4.59-4.6-4.59 4.6-2.12-2.12 4.6-4.59-4.6-4.59 2.12-2.12 4.59 4.6 4.59-4.6z" />
                      </svg>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    No pending member requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Profile (only if showProfile is true) */}
      {showProfile && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 py-44"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="no-scrollbar relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded bg-white p-5 shadow-lg dark:bg-boxdark"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="hover:text-gray-900 sticky right-8 top-0 z-20 text-3xl font-bold text-black transition-colors dark:text-white dark:hover:text-white"
              onClick={() => setShowProfile(false)}
            >
              &times;
            </button>
            {/* Profile Details */}
            <Profile user={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberRequest;
