"use client";
import React from "react";
import Image from "next/image";

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
    <div className="rounded-md mt-2 border h-fit w-fit border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
      {/* Main Content (Profile Pic + Info) */}
      <div className="px-4 pt-6 pb-6 sm:px-6 lg:pb-8">
        <div className="relative flex flex-col items-center md:-mt-12 md:flex-row md:items-start md:space-x-6">
          {/* Profile Pic */}
          <div className="flex-shrink-0">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md dark:border-boxdark sm:h-36 sm:w-36">
              <Image
                src={user.profilePic || "/images/user/user-06.png"}
                alt="profile"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Basic Info (Name, Department, etc.) */}
          <div className="mt-4 flex-1 text-center md:mt-12 md:text-left">
            <h3 className="mb-1 text-xl font-semibold text-black dark:text-white md:text-2xl">
              {user.name}
            </h3>
            <div className="rounded bg-white/70 p-2 dark:bg-boxdark/70 md:mt-2">
              <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                {user.department}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {user.email}
              </p>
              {user.phone && (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Phone: {user.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        {user.about && (
          <div className="mx-auto mt-6 max-w-2xl text-center md:text-left">
            <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">
              About
            </h4>
            <p
              className="
                text-sm
                leading-relaxed
                text-gray-600
                dark:text-gray-300
                break-words
                max-h-64
                overflow-y-auto
                scrollbar-hide
                pr-2      /* extra space for scrollbar on Windows, optional */
              "
            >
              {user.about}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-5 text-sm md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-3">
            <ProfileInfo label="Session" value={user.session} />
            <ProfileInfo label="Blood Group" value={user.bloodGroup} />
            <ProfileInfo label="Religion" value={user.religiousStatus} />
            <ProfileInfo label="Profession" value={user.profession} />
            <ProfileInfo label="Designation" value={user.designation} />
            <ProfileInfo label="School" value={user.schoolName} />
            <ProfileInfo label="College" value={user.collegeName} />
          </div>
          {/* Right Column */}
          <div className="space-y-3">
            <ProfileInfo label="Present Address" value={user.presentAddress} />
            <ProfileInfo
              label="Permanent Address"
              value={user.permanentAddress}
            />
            <ProfileInfo label="Facebook" value={user.facebookId} link />
            <ProfileInfo label="LinkedIn" value={user.linkedinId} link />
            <ProfileInfo label="Member" value={user.member ? "Yes" : "No"} />
            <ProfileInfo label="Alumni" value={user.alumni ? "Yes" : "No"} />
            <ProfileInfo
              label="Email Verified"
              value={user.emailVerified ? "Yes" : "No"}
            />
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
    <div>
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-blue-600 hover:underline dark:text-blue-400"
        >
          {value}
        </a>
      ) : (
        <p className="text-gray-700 dark:text-gray-200">{value}</p>
      )}
    </div>
  );
}

export default Profile;
