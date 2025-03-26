"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaEnvelope } from "react-icons/fa";
import Breadcrumb from "./Breadcrumbs/Breadcrumb";

interface DecodedToken {
  id: string;
}

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(true);

  // Fetch user data by ID
  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      setUserData(response.data.data);
      setLoading(false);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.id;
        if (userId) fetchUserData(userId);
      } catch (err) {
        setErrorMessage(err.message);
        setShowError(true);
        setLoading(false);
      }
    } else {
      // No token found
      setLoading(false);
    }
  }, []);

//   if (loading) {  // akhane akta sundor loader lagate hbe
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="border-blue-500 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
//       </div>
//     );
//   }

  if (!userData) {
    return (
      <div className="h-screen">
        {showError && errorMessage && (
        <div
          id="alert-additional-content-2"
          className="mb-4 rounded-lg border border-danger bg-[#FEF2F2] p-4 text-[#F87171] dark:border-danger dark:bg-[#1F2937] dark:text-[#F87171]"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="me-2 h-4 w-4 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <h3 className="text-lg font-medium">Error occurred: </h3>
          </div>
          <div className="mb-4 mt-2 text-sm">{errorMessage}</div>
          <div className="flex">
            <button
              type="button"
              onClick={() => setShowError(false)}
              className="rounded-lg border border-[#CB8686] bg-transparent px-3 py-1.5 text-center text-xs font-medium text-[#991B3E] hover:bg-[#991B3E] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#FCA5A5] dark:border-[#7E282F] dark:text-[#EF4443] dark:hover:bg-[#DC2626] dark:hover:text-white dark:focus:ring-[#991B1B]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Profile" />
    <section className="w-full overflow-hidden dark:bg-[#1A222C]">
      <div className="flex flex-col">
        {/* Cover Image */}
        <div className="relative h-44 w-full sm:h-56 md:h-64 lg:h-72 xl:h-80">
          <img
            src="/images/cover/cover-01.png"
            alt="User Cover"
            width={1920}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Profile Content Container */}
        <div className="z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
          {/* Profile Image and Name */}
          <div className="-mt-16 mb-8 flex flex-col items-start gap-4 sm:-mt-20 sm:flex-row sm:items-end md:-mt-24 lg:-mt-28">
            <div className="h-24 w-24 overflow-hidden rounded-lg border-4 border-white shadow-md dark:border-[#1f2937] sm:h-32 sm:w-32 md:h-40 md:w-40">
              <img
                src={userData.profilePic || "/images/user/user-01.png"}
                alt="Profile Picture"
                width={160}
                height={160}
                className="h-fit w-fit object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold text-[#1f2937] dark:text-white sm:text-3xl md:text-4xl">
                {userData.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <p className="text-sm text-[#4b5563] dark:text-[#d1d5db] sm:text-base">
                  {userData.profession
                    ? `${userData.profession},`
                    : "Profession Not Provided"}
                </p>
                <p className="text-sm text-[#4b5563] dark:text-[#d1d5db] sm:text-base">
                  {userData.designation
                    ? `${userData.designation} @ GSA-SUST`
                    : "Designation Not Provided"}
                </p>
              </div>
            </div>

            {/* Social Links for Desktop */}
            <div className="hidden items-center gap-3 sm:flex">
              {userData.email && (
                <Link
                  href={`mailto:${userData.email}`}
                  aria-label="Email"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] shadow-sm ring-1 ring-[#dbeafe] dark:from-[#1f2937] dark:to-[#374151] dark:ring-[#374151]">
                    <FaEnvelope className="text-lg text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                </Link>
              )}
              {userData.facebookId && (
                <Link
                  href={userData.facebookId}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] shadow-sm ring-1 ring-[#dbeafe] dark:from-[#1f2937] dark:to-[#374151] dark:ring-[#374151]">
                    <FaFacebookF className="text-lg text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                </Link>
              )}
              {userData.linkedinId && (
                <Link
                  href={userData.linkedinId}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] shadow-sm ring-1 ring-[#dbeafe] dark:from-[#1f2937] dark:to-[#374151] dark:ring-[#374151]">
                    <FaLinkedinIn className="text-lg text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile Social Links with matching professional design */}
            <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3 sm:hidden">
              {userData.email && (
                <Link
                  href={`mailto:${userData.email}`}
                  aria-label="Email"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] shadow-sm ring-1 ring-[#dbeafe] dark:from-[#1f2937] dark:to-[#374151] dark:ring-[#374151]">
                    <FaEnvelope className="text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                </Link>
              )}
              {userData.facebookId && (
                <Link
                  href={userData.facebookId}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] shadow-sm ring-1 ring-[#dbeafe] dark:from-[#1f2937] dark:to-[#374151] dark:ring-[#374151]">
                    <FaFacebookF className="text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                </Link>
              )}
              {userData.linkedinId && (
                <Link
                  href={userData.linkedinId}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] shadow-sm ring-1 ring-[#dbeafe] dark:from-[#1f2937] dark:to-[#374151] dark:ring-[#374151]">
                    <FaLinkedinIn className="text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#374151] dark:bg-[#1f2937]">
            <h2 className="mb-4 border-b border-[#e5e7eb] pb-2 text-xl font-semibold text-[#1f2937] dark:border-[#374151] dark:text-white">
              About
            </h2>
            <p className="text-[#4b5563] dark:text-[#d1d5db]">
              {userData.about || "No bio available."}
            </p>
          </div>

          {/* User Details */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#374151] dark:bg-[#1f2937]">
              <h2 className="mb-4 border-b border-[#e5e7eb] pb-2 text-xl font-semibold text-[#1f2937] dark:border-[#374151] dark:text-white">
                Personal Information
              </h2>

              <dl className="divide-y divide-[#e5e7eb] dark:divide-[#374151]">
                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Phone
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.phone || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Blood Group
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.bloodGroup || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Religious Status
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.religiousStatus || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Present Address
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.presentAddress || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Permanent Address
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.permanentAddress || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Academic Information */}
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#374151] dark:bg-[#1f2937]">
              <h2 className="mb-4 border-b border-[#e5e7eb] pb-2 text-xl font-semibold text-[#1f2937] dark:border-[#374151] dark:text-white">
                Academic Information
              </h2>

              <dl className="divide-y divide-[#e5e7eb] dark:divide-[#374151]">
                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Department
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.department || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Session
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.session || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    School
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.schoolName || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    College
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {userData.collegeName || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Social Links for Mobile - Fixed position */}
        <div className="fixed bottom-20 right-2 flex flex-col rounded-md bg-white shadow-lg dark:bg-[#1f2937] sm:hidden">
          {userData.facebookId && (
            <Link
              href={userData.facebookId}
              target="_blank"
              aria-label="Facebook"
            >
              <div className="rounded-t-md p-3 hover:bg-[#f3f4f6] dark:hover:bg-[#374151]">
                <FaFacebookF className="text-[#2563eb]" />
              </div>
            </Link>
          )}
          {userData.linkedinId && (
            <Link
              href={userData.linkedinId}
              target="_blank"
              aria-label="LinkedIn"
            >
              <div className="p-3 hover:bg-[#f3f4f6] dark:hover:bg-[#374151]">
                <FaLinkedinIn className="text-[#1d4ed8]" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
    </div>
  );
};

export default Profile;
