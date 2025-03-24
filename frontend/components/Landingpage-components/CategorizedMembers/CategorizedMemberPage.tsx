"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTheme, useMediaQuery } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import ProfileInfoCard from "@/components/Landingpage-components/CategorizedMembers/ProfileInfoCard";
import { TextAnimate } from "@/components/ui/text-animate";
import { SparklesText } from "@/components/ui/sparkles-text";

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


// Category Tab Interface
interface CategoryTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const CategorizedMembersPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ------------- State -------------
  const [members, setMembers] = useState<CategorizedMembers>({
    committee: [],
    advisors: [],
    alumni: [],
    generalMembers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("committee");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(12); // number of members per page

  // Category tabs
  const categoryTabs: CategoryTab[] = [
    { id: "committee", label: "Committee Members", icon: <GroupsIcon /> },
    { id: "advisors", label: "Advisors Panel", icon: <BadgeIcon /> },
    { id: "alumni", label: "Alumni", icon: <SchoolIcon /> },
    { id: "generalMembers", label: "General Members", icon: <PersonIcon /> },
  ];

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

  // Filter members based on search term
  const filteredMembers = members[
    activeCategory as keyof CategorizedMembers
  ].filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.designation &&
        member.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.department &&
        member.department.toLowerCase().includes(searchTerm.toLowerCase())),
  );

// Pagination logic
const indexOfLastMember = currentPage * membersPerPage;
const indexOfFirstMember = indexOfLastMember - membersPerPage;
const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

// Change page
const paginate = (pageNumber: number) => {
  if (pageNumber > 0 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Generate page numbers
const pageNumbers = [];
const maxPageNumbersToShow = 4;

let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

if (endPage - startPage + 1 < maxPageNumbersToShow) {
  startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
}

for (let i = startPage; i <= endPage; i++) {
  pageNumbers.push(i);
}




  // Loading UI
  if (loading) {
    return (
      <>
        <div className="mx-auto max-w-7xl px-4 py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
          {/* Section Header Skeleton */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-[#e5e7eb] dark:bg-[#374151] h-10 w-64 animate-pulse rounded-lg"></div>
            </div>
            <div className="mb-4 flex items-center justify-center">
              <div className="bg-[#e5e7eb] dark:bg-[#374151] h-1 w-16 rounded-full"></div>
              <div className="bg-[#e5e7eb] dark:bg-[#374151] mx-2 h-1 w-8 rounded-full"></div>
              <div className="bg-[#e5e7eb] dark:bg-[#374151] h-1 w-4 rounded-full"></div>
            </div>
            <div className="bg-[#e5e7eb] dark:bg-[#374151] mx-auto h-6 w-2/3 animate-pulse rounded-md"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="relative mx-auto mb-8 max-w-md">
            <div className="bg-[#e5e7eb] dark:bg-[#374151] h-10 animate-pulse rounded-md"></div>
          </div>

          {/* Category Tabs Skeleton */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex justify-center space-x-2 pb-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-[#e5e7eb] dark:bg-[#374151] h-10 w-40 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          </div>

          {/* Members Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="dark:bg-[#1f2937] animate-pulse overflow-hidden rounded-xl bg-white shadow-md"
              >
                <div className="bg-[#e5e7eb] dark:bg-[#374151] h-48"></div>
                <div className="space-y-3 p-5">
                  <div className="bg-[#e5e7eb] dark:bg-[#374151] h-5 w-3/4 rounded"></div>
                  <div className="bg-[#e5e7eb] dark:bg-[#374151] h-4 w-1/2 rounded"></div>
                  <div className="bg-[#e5e7eb] dark:bg-[#374151] h-4 w-5/6 rounded"></div>
                  <div className="flex space-x-3 pt-2">
                    <div className="bg-[#e5e7eb] dark:bg-[#374151] h-8 w-8 rounded-full"></div>
                    <div className="bg-[#e5e7eb] dark:bg-[#374151] h-8 w-8 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-xl border-l-4 border-[#ef4444] bg-[#fef2f2] p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-[#b91c1c] font-medium">Error loading members</p>
              <p className="mt-1 text-[#ef4444]">{error}</p>
              <button
                onClick={fetchCategorizedMembers}
                className="hover:bg-[#dc2626] mt-3 rounded bg-[#ef4444] px-4 py-2 text-white transition-colors"
              >
                Try Again
              </button>
            </div>
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
      <div className=" min-h-screen px-4 py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <div className="relative mb-12"> 
              <SparklesText text="Our Members" className=""/>
              <div className="mt-4 flex items-center justify-center">
                <div className="to-[#60a5fa] h-1 w-16 rounded-full bg-gradient-to-r from-[#2563eb]"></div>
                <div className="bg-[#d1d5db] dark:bg-[#374151] mx-2 h-1 w-8 rounded-full"></div>
                <div className="bg-[#e5e7eb] dark:bg-[#1f2937] h-1 w-4 rounded-full"></div>
              </div>
              <div className="absolute left-1/2 top-1/2 -z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary opacity-10 blur-3xl"></div>
            </div>
            <TextAnimate
              animation="blurInUp"
              by="character"
              once
              className="text-lg text-[#4b5563] dark:text-[#d1d5db]"
            >
              Meet our association members across different categories
            </TextAnimate>
          </div>

          {/* Search Bar */}
          <div className="relative mx-auto mb-8 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-[#9ca3af]" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-[#d1d5db] bg-white py-2 pl-10 pr-3 leading-5 placeholder-[#6b7280] focus:border-[#6366f1] focus:placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#6366f1] dark:border-[#374151] dark:bg-[#1f2937] dark:text-white sm:text-sm"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="scrollbar-hide mb-8 overflow-x-auto">
            <div
              className={`flex space-x-2 ${
                isMobile ? "pb-2" : "justify-center"
              }`}
            >
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center whitespace-nowrap rounded-lg px-4 py-2 transition-all
                  ${
                    activeCategory === tab.id
                      ? "bg-[#4564E3] text-white shadow-md"
                      : "bg-white text-[#374151] hover:bg-[#f3f4f6] dark:bg-[#1f2937] dark:text-[#d1d5db] dark:hover:bg-[#374151]"
                  }
                `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className="ml-2 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs text-[#374151] dark:bg-[#374151] dark:text-[#d1d5db]">
                    {members[tab.id as keyof CategorizedMembers]?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Members Grid */}
          {currentMembers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentMembers.map((member) => (
                <div key={member._id}>
                  <ProfileInfoCard
                    user={{
                      _id: member._id,
                      name: member.name,
                      profession: member.profession,
                      department: member.department,
                      photoUrl: member.profilePic,
                      email: member.email,
                      facebookId: member.facebookId,
                      linkedinId: member.linkedinId,
                      designation: member.designation,
                    }}
                    key={member._id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="mb-4 text-[#9ca3af] dark:text-[#6b7280]">
                <PersonIcon style={{ fontSize: 64, margin: "0 auto" }} />
              </div>
              {searchTerm ? (
                <h3 className="text-lg font-medium text-[#111827] dark:text-[#f3f4f6]">
                  No members match your search
                </h3>
              ) : (
                <h3 className="text-lg font-medium text-[#111827] dark:text-[#f3f4f6]">
                  No members in this category
                </h3>
              )}
              <p className="mt-1 text-sm text-[#6b7280] dark:text-[#9ca3af]">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Check back later for updates"}
              </p>
            </div>
          )}
        </div>

          {/* Pagination */}
          {filteredMembers.length > membersPerPage && (
            <div
              className="wow fadeInUp -mx-4 flex flex-wrap"
              data-wow-delay=".15s"
            >
              <div className="w-full px-4">
                <ul className="flex items-center justify-center pt-8">
                  <li className="mx-1">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition ${
                        currentPage === 1
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-primary hover:bg-opacity-100 hover:text-white"
                      }`}
                    >
                      Prev
                    </button>
                  </li>
                  
                  {startPage > 1 && (
                    <>
                      <li className="mx-1">
                        <button
                          onClick={() => paginate(1)}
                          className={`flex h-9 min-w-[36px] items-center justify-center rounded-md ${
                            currentPage === 1
                              ? "bg-primary bg-opacity-100 text-white"
                              : "bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white"
                          } px-4 text-sm transition`}
                        >
                          1
                        </button>
                      </li>
                      {startPage > 2 && (
                        <li className="mx-1">
                          <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                            ...
                          </span>
                        </li>
                      )}
                    </>
                  )}
                  
                  {pageNumbers.map((number) => (
                    <li key={number} className="mx-1">
                      <button
                        onClick={() => paginate(number)}
                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-md ${
                          currentPage === number
                            ? "bg-primary bg-opacity-100 text-white"
                            : "bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white"
                        } px-4 text-sm transition`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  
                  {endPage < totalPages && (
                    <>
                      {endPage < totalPages - 1 && (
                        <li className="mx-1">
                          <span className="flex h-9 min-w-[36px] cursor-not-allowed items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color">
                            ...
                          </span>
                        </li>
                      )}
                      <li className="mx-1">
                        <button
                          onClick={() => paginate(totalPages)}
                          className={`flex h-9 min-w-[36px] items-center justify-center rounded-md ${
                            currentPage === totalPages
                              ? "bg-primary bg-opacity-100 text-white"
                              : "bg-body-color bg-opacity-[15%] text-body-color hover:bg-primary hover:bg-opacity-100 hover:text-white"
                          } px-4 text-sm transition`}
                        >
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}
                  
                  <li className="mx-1">
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-md bg-body-color bg-opacity-[15%] px-4 text-sm text-body-color transition ${
                        currentPage === totalPages
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-primary hover:bg-opacity-100 hover:text-white"
                      }`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}

      </div>
    </>
  );
};

export default CategorizedMembersPage;
