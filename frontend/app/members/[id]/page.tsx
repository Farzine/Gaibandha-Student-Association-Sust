"use client";
import Profile from "@/components/Landingpage-components/CategorizedMembers/ProfileCard";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

interface ProfileProps {
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

const MemberProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // States
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch member data on component mount
  useEffect(() => {
    if (id) {
      fetchMemberData();
    }
  }, [id]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/adminTask/member-request/${id}`,
      );

      if (res.data && res.data.data) {
        setUser(res.data.data);
      } else {
        throw new Error("Invalid data received from server");
      }
    } catch (err: any) {
      console.error("Error fetching member data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load member details",
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div
            className="border-indigo-600 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Loading member profile...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border-red-500 w-full max-w-md rounded-lg border-l-4 p-6 shadow-md">
          <h2 className="text-red-700 dark:text-red-400 mb-2 text-xl font-bold">
            Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">
            {error || "Member not found"}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => fetchMemberData()}
              className="bg-red-600 hover:bg-red-700 rounded px-4 py-2 text-white transition-colors duration-200"
            >
              Try Again
            </button>
            <Link href="/members">
              <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded px-4 py-2 transition-colors duration-200">
                Back to Members
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <span className="absolute left-0 top-0 z-[-1]">
          <svg
            width="287"
            height="254"
            viewBox="0 0 287 254"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z"
              fill="url(#paint0_linear_111:578)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_111:578"
                x1="-40.5"
                y1="117"
                x2="301.926"
                y2="-97.1485"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span className="absolute right-0 top-0 z-[-1]">
          <svg
            width="628"
            height="258"
            viewBox="0 0 628 258"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z"
              fill="url(#paint0_linear_0:1)"
            />
            <path
              opacity="0.1"
              d="M0.0716344 182.78L101.988 -15.0769L142.154 81.4093L0.0716344 182.78Z"
              fill="url(#paint1_linear_0:1)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_0:1"
                x1="644"
                y1="221"
                x2="429.946"
                y2="37.0429"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_0:1"
                x1="18.3648"
                y1="166.016"
                x2="105.377"
                y2="32.3398"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
      <div className="py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
        <Profile user={user} />
      </div>
    </>
  );
};

export default MemberProfilePage;
