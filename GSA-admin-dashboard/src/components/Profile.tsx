"use client";
import React from "react";
import Image from "next/image";
import { FaFacebookF, FaLinkedinIn, FaEnvelope, FaPhone } from "react-icons/fa";

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
    <div className="mx-auto max-w-4xl rounded-xl border border-[#f3f4f6] bg-white shadow-xl transition-all dark:border-[#374151] dark:bg-[#1f2937]">

      {/* Profile Container */}
      <div className="px-4 pb-8 sm:px-8">
        {/* Profile Picture and Basic Info */}
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
          {/* Profile Picture */}
          <div className="relative -mt-16 flex-shrink-0 md:-mt-20">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md dark:border-[#374151] md:h-40 md:w-40">
              <Image
                src={user.profilePic || "/images/user/user-06.png"}
                alt={user.name}
                fill
                className="w-fit h-fit"
                sizes="(max-width: 768px) 128px, 160px"
                priority
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="mt-4 flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white md:text-3xl">
              {user.name}
            </h1>
            <p className="mt-1 text-lg font-medium text-[#374151] dark:text-[#e5e7eb]">
              {user.department}
            </p>
            
            {/* Contact Info Row */}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                <FaEnvelope className="mr-2 h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center text-[#4b5563] dark:text-[#d1d5db]">
                  <FaPhone className="mr-2 h-4 w-4" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              
              {/* Social Media Links */}
              <div className="flex gap-3">
                {user.facebookId && (
                  <a
                    href={user.facebookId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors"
                    aria-label="Facebook Profile"
                  >
                    <FaFacebookF />
                  </a>
                )}
                {user.linkedinId && (
                  <a
                    href={user.linkedinId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d4ed8] text-white hover:bg-[#1e40af] transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <FaLinkedinIn />
                  </a>
                )}
              </div>
            </div>
            
            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              {user.member && (
                <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-medium text-[#166534] dark:bg-[#14532d] dark:text-[#bbf7d0]">
                  Member
                </span>
              )}
              {user.alumni && (
                <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-medium text-[#1e40af] dark:bg-[#1e3a8a] dark:text-[#bfdbfe]">
                  Alumni
                </span>
              )}
              {user.emailVerified && (
                <span className="rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-medium text-[#6b21a8] dark:bg-[#581c87] dark:text-[#e9d5ff]">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* About Section */}
          <div className="lg:col-span-3">
            {user.about && (
              <section className="rounded-lg bg-[#f9fafb] p-6 shadow-sm dark:bg-[#374151]/30">
                <h2 className="mb-3 text-xl font-semibold text-[#111827] dark:text-white">
                  About
                </h2>
                <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[#d1d5db] dark:scrollbar-thumb-[#4b5563] pr-2">
                  {user.about}
                </p>
              </section>
            )}
          </div>

          {/* Personal Info */}
          <div className="lg:col-span-2">
            <section className="rounded-lg bg-[#f9fafb] p-6 shadow-sm dark:bg-[#374151]/30 h-full">
              <h2 className="mb-4 text-xl font-semibold text-[#111827] dark:text-white">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
                <ProfileInfo label="Session" value={user.session} />
                <ProfileInfo label="Blood Group" value={user.bloodGroup} />
                <ProfileInfo label="Religion" value={user.religiousStatus} />
                <ProfileInfo label="Profession" value={user.profession} />
                <ProfileInfo label="Designation" value={user.designation} />
                <ProfileInfo label="Present Address" value={user.presentAddress} />
                <ProfileInfo label="Permanent Address" value={user.permanentAddress} />
              </div>
            </section>
          </div>

          {/* Education */}
          <div>
            <section className="rounded-lg bg-[#f9fafb] p-6 shadow-sm dark:bg-[#374151]/30 h-full">
              <h2 className="mb-4 text-xl font-semibold text-[#111827] dark:text-white">
                Education
              </h2>
              <div className="space-y-4">
                <ProfileInfo label="School" value={user.schoolName} />
                <ProfileInfo label="College" value={user.collegeName} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProfileInfoProps {
  label: string;
  value?: string | null;
  link?: boolean;
}

/** A small helper to show label-value pairs. Hides if the value is empty. */
function ProfileInfo({ label, value, link }: ProfileInfoProps) {
  if (!value) return null;

  return (
    <div className="group">
      <p className="text-sm font-medium text-[#f9fafb] dark:text-[#9ca3af]">
        {label}
      </p>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block break-all text-[#2563eb] hover:underline dark:text-[#60a5fa] transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-[#1f2937] dark:text-[#e5e7eb]">{value}</p>
      )}
    </div>
  );
}

export default Profile;