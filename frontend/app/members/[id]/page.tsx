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
      <div className="min-h-screen bg-[#f9fafb] py-16 pt-28 dark:bg-[#111827] md:py-20 lg:py-28 lg:pt-[150px]">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">

            {/* Profile card skeleton */}
            <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-md dark:bg-[#1e293b]">
              <div className="flex flex-col md:flex-row">
                {/* Profile image skeleton */}
                <div className="flex items-center justify-center p-6 md:w-1/3">
                  <div className="bg-[#e2e8f0] dark:bg-[#334155] h-48 w-48 rounded-full"></div>
                </div>

                {/* Profile details skeleton */}
                <div className="space-y-6 p-6 md:w-2/3">
                  <div className="space-y-3">
                    <div className="bg-[#e2e8f0] dark:bg-[#334155] h-8 w-3/4 rounded-md"></div>
                    <div className="bg-[#e2e8f0] dark:bg-[#334155] h-4 w-1/2 rounded"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="bg-[#e2e8f0] dark:bg-[#334155] h-4 w-1/3 rounded"></div>
                        <div className="bg-[#e2e8f0] dark:bg-[#334155] h-6 w-full rounded"></div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#e2e8f0] dark:bg-[#334155] h-4 w-1/4 rounded"></div>
                    <div className="bg-[#e2e8f0] dark:bg-[#334155] h-24 rounded"></div>
                  </div>

                  <div className="flex space-x-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-[#e2e8f0] dark:bg-[#334155] h-10 w-10 rounded-md"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9fafb] p-4 dark:bg-[#111827]">
        <div className="w-full max-w-md rounded-lg border-l-4 border-[#ef4444] bg-[#fef2f2] p-6 shadow-md">
          <h2 className="mb-2 text-xl font-bold text-[#b91c1c] dark:text-[#f87171]">
            Error
          </h2>
          <p className="mb-4 text-[#dc2626] dark:text-[#fca5a5]">
            {error || "Member not found"}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => fetchMemberData()}
              className="rounded bg-[#dc2626] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#b91c1c]"
            >
              Try Again
            </button>
            <Link href="/members">
              <button className="rounded bg-[#e5e7eb] px-4 py-2 text-[#1f2937] transition-colors duration-200 hover:bg-[#d1d5db] dark:bg-[#374151] dark:text-[#e5e7eb] dark:hover:bg-[#4b5563]">
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
