"use client";
import Profile from "@/components/Profile";
import Alert from "@/components/Alert";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

/** The extended User interface */
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

/** Response shape from categorizeMember API */
interface CategorizedMembers {
  committee: User[];
  advisors: User[];
  alumni: User[];
  generalMembers: User[];
}

/** Possible designations */
const DESIGNATION_OPTIONS = [
  "President",
  "Senior Vice President",
  "Vice-President",
  "General Secretary",
  "Joint General Secretary",
  "Assistant General Secretary",
  "Treasurer",
  "Assistant Treasurer",
  "Organizing Secretary",
  "Assistant Organizing Secretary",
  "Office Secretary",
  "Assistant Office Secretary",
  "Women's Affairs Secretary",
  "Assistant Women's Affairs Secretary",
  "Sports Secretary",
  "Assistant Sports Secretary",
  "Publication Secretary",
  "Assistant Publication Secretary",
  "IT Secretary",
  "Assistant IT Secretary",
  "Cultural Secretary",
  "Assistant Cultural Secretary",
  "Advisor",
  "Member",
];

const CategorizedMembersPage: React.FC = () => {
  // ------------- State -------------
  const [members, setMembers] = useState<CategorizedMembers>({
    committee: [],
    advisors: [],
    alumni: [],
    generalMembers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // For success/error alerts
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ------------- Effects -------------
  // Fetch categorized members on mount
  useEffect(() => {
    fetchCategorizedMembers();
  }, []);

  const fetchCategorizedMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/categorizeMember`,
      );
      setMembers(res.data.data as CategorizedMembers);
    } catch (err) {
      setError("Failed to fetch categorized members");
    } finally {
      setLoading(false);
    }
  };

  // ------------- Handlers -------------
  // Update member designation
  const handleDesignationChange = async (
    userId: string,
    newDesignation: string,
  ) => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/update-designation`,
        { userId, designation: newDesignation },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setShowSuccess(true);
      setSuccessMessage("Designation updated successfully!");
      fetchCategorizedMembers();
    } catch (err: any) {
      setShowError(true);
      setErrorMessage(
        err?.response?.data?.message || "Error updating designation.",
      );
    }
  };

  // Update alumni status
  const handleAlumniChange = async (
    userId: string,
    newAlumniValue: boolean,
  ) => {
    try {
      clearAlerts();

      const token = Cookies.get("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/update-alumniStatus`,
        { userId, alumniStatus: newAlumniValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowSuccess(true);
      setSuccessMessage("Alumni status updated successfully!");
      fetchCategorizedMembers();
    } catch (err: any) {
      setShowError(true);
      setErrorMessage(
        err?.response?.data?.message || "Error updating alumni status.",
      );
      if (err?.response?.data?.errors) {
        setErrorMessage(
          err.response.data.errors.map((error: any) => error.msg).join(", "),
        );
      }
    }
  };

  /** Helper to clear all success/error flags */
  const clearAlerts = () => {
    setShowSuccess(false);
    setSuccessMessage("");
    setShowError(false);
    setErrorMessage("");
  };

  // Open modal with user details
  const openProfile = async (userId: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/member-request/${userId}`,
      );
      setSelectedUser(res.data.data);
      setShowProfile(true);
    } catch (err) {
      setShowError(true);
      setErrorMessage("Failed to fetch user details.");
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

  // ------------- Render Helpers -------------
  // Render each row in the table
  const renderMemberRow = (user: User) => {
    return (
      <div
        key={user._id}
        className="grid grid-cols-1 gap-10 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-2 md:grid-cols-7 lg:grid-cols-10 xl:px-6 2xl:px-7.5"
      >
        {/* Name & Image */}
        <div className="col-span-1 flex items-center sm:col-span-1 md:col-span-2">
          <button
            onClick={() => openProfile(user._id)}
            className="flex items-center space-x-3"
          >
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={user.profilePic || "/images/user/user-06.png"}
                width={60}
                height={50}
                alt="User"
                className="object-cover"
              />
            </div>
            <p className="line-clamp-2 text-sm font-bold text-black hover:text-[#005CC8] hover:underline dark:text-white dark:hover:text-[#005CC8]">
              {user.name}
            </p>
          </button>
        </div>

        {/* Department */}
        <div className="col-span-1 flex items-center sm:col-span-1 md:col-span-2">
          <p className="line-clamp-1 text-sm text-black dark:text-white">
            {user.department}
          </p>
        </div>

        {/* Session */}
        <div className="col-span-1 flex items-center sm:col-span-1 md:col-span-2">
          <p className="text-sm text-black dark:text-white">{user.session}</p>
        </div>

        {/* Designation dropdown */}
        <div className="col-span-1 flex items-center sm:col-span-1 md:col-span-2">
          <select
            value={user.designation || "Member"}
            onChange={(e) => handleDesignationChange(user._id, e.target.value)}
            className="border-gray-300 w-full rounded-md border bg-white p-2 text-sm dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            {DESIGNATION_OPTIONS.map((des) => (
              <option key={des} value={des}>
                {des}
              </option>
            ))}
          </select>
        </div>

        {/* Alumni checkbox */}
        <div className="col-span-1 flex items-center sm:col-span-1 md:col-span-1">
          <input
            type="checkbox"
            checked={!!user.alumni}
            onChange={(e) => handleAlumniChange(user._id, e.target.checked)}
            className="border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-black dark:text-white">
            Alumni
          </label>
        </div>
      </div>
    );
  };

  // Renders a table block for a category (committee, advisors, etc.)
  const renderCategoryTable = (title: string, data: User[]) => {
    return (
      <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            {title}
          </h4>
        </div>

        {/* Table Header */}
        <div className="lg:grid-cols-16 hidden grid-cols-1 gap-10 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid sm:grid-cols-2 md:grid-cols-10 xl:px-6 2xl:px-7.5">
          <div className="col-span-1 sm:col-span-1 md:col-span-2">
            <p className="font-medium">Name</p>
          </div>
          <div className="col-span-1 sm:col-span-1 md:col-span-2">
            <p className="font-medium">Department</p>
          </div>
          <div className="col-span-1 sm:col-span-1 md:col-span-2">
            <p className="font-medium">Session</p>
          </div>
          <div className="col-span-1 sm:col-span-1 md:col-span-2">
            <p className="font-medium">Designation</p>
          </div>
          <div className="col-span-1 sm:col-span-1 md:col-span-1">
            <p className="font-medium">Alumni</p>
          </div>
        </div>

        {/* Rows */}
        {data.map(renderMemberRow)}
        {data.length === 0 && (
          <div className="text-gray-500 px-4 py-4 text-center">
            No members found in this category.
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Alert Components */}
      {showSuccess && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}

      {/* Category Tables */}
      {renderCategoryTable("Committee Members", members.committee)}
      {renderCategoryTable("Advisors", members.advisors)}
      {renderCategoryTable("Alumni", members.alumni)}
      {renderCategoryTable("General Members", members.generalMembers)}

      {/* Profile Modal */}
      {showProfile && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="no-scrollbar relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5 shadow-lg dark:bg-boxdark"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 absolute right-4 top-4 text-xl"
              onClick={() => setShowProfile(false)}
            >
              ×
            </button>
            <Profile user={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorizedMembersPage;
