"use client";
import React from "react";
import Image from "next/image";
import { FaFacebookF, FaLinkedinIn, FaEnvelope, FaPhone } from "react-icons/fa";
import Link from "next/link";

interface ProfileProps {
  user: {
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
  };
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="mx-auto max-w-7xl">
    <section className="w-full overflow-hidden dark:bg-[#1A222C]">
      <div className="flex flex-col">
        {/* Cover Image */}
        <div className="relative h-44 w-full sm:h-56 md:h-64 lg:h-72 xl:h-80">
          <Image
            src="/images/cover/cover-01.png"
            alt="User Cover"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Profile Content Container */}
        <div className="z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
          {/* Profile Image and Name */}
          <div className="-mt-16 mb-8 flex flex-col items-start gap-4 sm:-mt-20 sm:flex-row sm:items-end md:-mt-24 lg:-mt-28">
            <div className="h-24 w-24 overflow-hidden rounded-lg border-4 border-white shadow-md dark:border-[#1f2937] sm:h-32 sm:w-32 md:h-40 md:w-40">
              <Image
              src={user.profilePic || "/images/user/user-01.png"}
              alt="Profile Picture"
              width={160}
              height={160}
              className="h-full w-full object-cover"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
              />
            </div>

            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold text-[#1f2937] dark:text-white sm:text-3xl md:text-4xl">
                {user.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <p className="text-sm text-[#4b5563] dark:text-[#d1d5db] sm:text-base">
                  {user.profession
                    ? `${user.profession},`
                    : "Profession Not Provided"}
                </p>
                <p className="text-sm text-[#4b5563] dark:text-[#d1d5db] sm:text-base">
                  {user.designation
                    ? `${user.designation} @ GSA-SUST`
                    : "Designation Not Provided"}
                </p>
              </div>
            </div>

            {/* Social Links for Desktop */}
            <div className="hidden items-center gap-3 sm:flex">
              {user.email && (
                <Link
                  href={`mailto:${user.email}`}
                  aria-label="Email"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] shadow-sm ring-1 ring-[#dbeafe] dark:from-[#1f2937] dark:to-[#374151] dark:ring-[#374151]">
                    <FaEnvelope className="text-lg text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                </Link>
              )}
              {user.facebookId && (
                <Link
                  href={user.facebookId}
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
              {user.linkedinId && (
                <Link
                  href={user.linkedinId}
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
              {user.email && (
                <Link
                  href={`mailto:${user.email}`}
                  aria-label="Email"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#eff6ff] to-[#eef2ff] shadow-sm ring-1 ring-[#dbeafe] dark:from-[#1f2937] dark:to-[#374151] dark:ring-[#374151]">
                    <FaEnvelope className="text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                </Link>
              )}
              {user.facebookId && (
                <Link
                  href={user.facebookId}
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
              {user.linkedinId && (
                <Link
                  href={user.linkedinId}
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
              {user.about || "No bio available."}
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
                    {user.phone || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Blood Group
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {user.bloodGroup || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Religious Status
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {user.religiousStatus || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Present Address
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {user.presentAddress || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Permanent Address
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {user.permanentAddress || "N/A"}
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
                    {user.department || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    Session
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {user.session || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    School
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {user.schoolName || "N/A"}
                  </dd>
                </div>

                <div className="flex flex-col py-3 sm:flex-row">
                  <dt className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af] sm:w-40">
                    College
                  </dt>
                  <dd className="mt-1 text-[#1f2937] dark:text-white sm:mt-0">
                    {user.collegeName || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Social Links for Mobile - Fixed position */}
        <div className="fixed bottom-20 right-2 flex flex-col rounded-md bg-white shadow-lg dark:bg-[#1f2937] sm:hidden">
          {user.facebookId && (
            <Link
              href={user.facebookId}
              target="_blank"
              aria-label="Facebook"
            >
              <div className="rounded-t-md p-3 hover:bg-[#f3f4f6] dark:hover:bg-[#374151]">
                <FaFacebookF className="text-[#2563eb]" />
              </div>
            </Link>
          )}
          {user.linkedinId && (
            <Link
              href={user.linkedinId}
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