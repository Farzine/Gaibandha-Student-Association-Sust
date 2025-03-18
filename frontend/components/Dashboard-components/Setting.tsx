"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Dashboard-components/Breadcrumbs/Breadcrumb";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

// Heroicons (example). Install with: npm i @heroicons/react
import {
  UserIcon,
  PhoneIcon,
  PencilSquareIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

interface DecodedToken {
  id: string;
}

// Department & Religious enums (adjust as needed)
const DEPARTMENTS = [
  "Anthropology",
  "Architecture",
  "Bangla",
  "Biochemistry & Molecular Biology",
  "Business Administration",
  "Chemical Engineering & Polymer Science",
  "Chemistry",
  "Civil & Environmental Engineering",
  "Computer Science & Engineering",
  "Economics",
  "Electrical & Electronics Engineering",
  "English",
  "Food & Tea Technology",
  "Foresrty and Environmental Science",
  "Genetic Engineering & Biotechnology",
  "Geography & Environment",
  "Geography & Environmental",
  "Industrial & Production Engineering",
  "Mathematics",
  "Petroleum & Georesources Engineering",
  "Physics",
  "Political Studies",
  "Public Administration",
  "Social Work",
  "Sociology",
  "Software Engineering",
  "Statistics",
];

const RELIGIONS = ["Muslim", "Hindu", "Christian", "Buddhist", "Other"];

const BLOOD_GROUPS = ["A+", "B+", "O+", "A-", "B-", "O-", "AB+", "AB-"];

export default function Settings() {
  const router = useRouter();

  // ----- Local state for form fields -----
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [facebookId, setFacebookId] = useState("");
  const [linkedinId, setLinkedinId] = useState("");
  const [about, setAbout] = useState("");
  const [religiousStatus, setReligiousStatus] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [phone, setPhone] = useState("");

  // For profile picture:
  // - 'profilePic' is the new selected File
  // - 'existingProfilePicUrl' is the user's currently stored profile photo URL
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [existingProfilePicUrl, setExistingProfilePicUrl] = useState<string>(
    "/images/user/default-avatar.png",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----- Local state for UI feedback -----
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);

  // ----- Validation Regex -----
  const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
  const facebookRegex = /^https?:\/\/(www\.)?facebook\.com/;
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com/;
  const sessionRegex = /^\d{4}-\d{4}$/;

  // ─────────────────────────────────────────────────────────
  //  FETCH CURRENT USER DATA ON MOUNT
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        setLoading(true);

        // Replace with your actual endpoint that returns current user info
        // e.g. /user/me, /user/current, etc.
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/${userId}`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) {
          setErrorMessage("Failed to fetch user data.");
          setShowError(true);
          return;
        }
        const json = await res.json();
        // Assuming the response is something like: { success: true, data: userObject }
        const user = json.data;

        // Populate states with user info
        setName(user.name || "");
        setDepartment(user.department || "");
        setSession(user.session || "");
        setBloodGroup(user.bloodGroup || "");
        setPresentAddress(user.presentAddress || "");
        setPermanentAddress(user.permanentAddress || "");
        setProfession(user.profession || "");
        setFacebookId(user.facebookId || "");
        setLinkedinId(user.linkedinId || "");
        setAbout(user.about || "");
        setReligiousStatus(user.religiousStatus || "");
        setSchoolName(user.schoolName || "");
        setCollegeName(user.collegeName || "");
        setPhone(user.phone || "");

        // If user already has a profile photo stored in DB, display it
        // else fallback to local default
        if (user.profilePic) {
          setExistingProfilePicUrl(user.profilePic);
        }
      } catch (err: any) {
        setErrorMessage(err.message);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.id;
        if (userId) fetchUserData(userId);
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
  }, []);

  // ─────────────────────────────────────────────────────────
  //   HANDLE FORM SUBMIT
  // ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // ----- Client-side validations -----
    if (phone && !phoneRegex.test(phone)) {
      setErrorMessage("Invalid Bangladeshi phone number format.");
      setShowError(true);
      return;
    }
    if (facebookId && !facebookRegex.test(facebookId)) {
      setErrorMessage(
        "Invalid Facebook URL. Must start with https://facebook.com",
      );
      setShowError(true);
      return;
    }
    if (linkedinId && !linkedinRegex.test(linkedinId)) {
      setErrorMessage(
        "Invalid LinkedIn URL. Must start with https://linkedin.com",
      );
      setShowError(true);
      return;
    }
    if (session && !sessionRegex.test(session)) {
      setErrorMessage("Session must be in YYYY-YYYY format.");
      setShowError(true);
      return;
    }

    // Build FormData for multipart/form-data (file + text fields)
    const formData = new FormData();
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }
    // append text fields only if they have a value (or you can always append them):
    if (name) formData.append("name", name);
    if (department) formData.append("department", department);
    if (session) formData.append("session", session);
    if (bloodGroup) formData.append("bloodGroup", bloodGroup);
    if (presentAddress) formData.append("presentAddress", presentAddress);
    if (permanentAddress) formData.append("permanentAddress", permanentAddress);
    if (profession) formData.append("profession", profession);
    if (facebookId) formData.append("facebookId", facebookId);
    if (linkedinId) formData.append("linkedinId", linkedinId);
    if (about) formData.append("about", about);
    if (religiousStatus) formData.append("religiousStatus", religiousStatus);
    if (schoolName) formData.append("schoolName", schoolName);
    if (collegeName) formData.append("collegeName", collegeName);
    if (phone) formData.append("phone", phone);

    try {
        setLoading(true);
        const token = Cookies.get("token");
        if (!token) {
          setErrorMessage("No token found. Please log in again.");
          setShowError(true);
          setLoading(false);
          return;
        }
  
        // Make API call to update user
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/updateUser`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await res.json();
  
        if (!res.ok) {
          setErrorMessage(data.error || data.message || "Something went wrong");
          setShowError(true);
        } else {
          // If successful, show success message
          setSuccessMessage("Profile updated successfully!");
          setShowSuccess(true);
        }
      } catch (err: any) {
        setErrorMessage(err.message);
        setShowError(true);
      } finally {
        setLoading(false);
      }
  };

  // ─────────────────────────────────────────────────────────
  //   HANDLE FILE SELECT
  // ─────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePic(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        {/* === MAIN FORM SECTION === */}
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Personal Information
              </h3>
            </div>

            <div className="p-7">
              

              {loading && <div className="text-blue-500 mb-4">Loading...</div>}

              <form onSubmit={handleSubmit}>
                {/* FULL NAME + PHONE */}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* Full Name */}
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="text-gray-400 absolute left-4.5 top-4 h-5 w-5" />
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black 
                          focus:border-primary focus-visible:outline-none 
                          dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="text-gray-400 absolute left-4.5 top-3.5 h-5 w-5" />
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black 
                          focus:border-primary focus-visible:outline-none 
                          dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="e.g. +8801XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* DEPARTMENT */}
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="department"
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 
                      text-black focus:border-primary focus-visible:outline-none 
                      dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">--Select Department--</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SESSION + BLOOD GROUP */}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* Session */}
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="session"
                    >
                      Session (YYYY-YYYY)
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="session"
                      id="session"
                      placeholder="e.g. 2018-2019"
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="bloodGroup"
                    >
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 
                        text-black focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                    >
                      <option value="">--Select Blood Group--</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PRESENT + PERMANENT ADDRESS */}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* Present Address */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Present Address
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="Enter present address"
                      value={presentAddress}
                      onChange={(e) => setPresentAddress(e.target.value)}
                    />
                  </div>

                  {/* Permanent Address */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Permanent Address
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="Enter permanent address"
                      value={permanentAddress}
                      onChange={(e) => setPermanentAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* PROFESSION + RELIGIOUS STATUS */}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* Profession */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Profession
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="e.g. Software Engineer"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                    />
                  </div>

                  {/* Religious Status */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Religious Status
                    </label>
                    <select
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 
                        text-black focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      value={religiousStatus}
                      onChange={(e) => setReligiousStatus(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {RELIGIONS.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* FACEBOOK + LINKEDIN */}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* Facebook ID */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Facebook ID (URL)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="https://facebook.com/your_profile"
                      value={facebookId}
                      onChange={(e) => setFacebookId(e.target.value)}
                    />
                  </div>

                  {/* LinkedIn ID */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      LinkedIn ID (URL)
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="https://linkedin.com/in/your_profile"
                      value={linkedinId}
                      onChange={(e) => setLinkedinId(e.target.value)}
                    />
                  </div>
                </div>

                {/* SCHOOL + COLLEGE */}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* School Name */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      School Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="Enter your school name"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>

                  {/* College Name */}
                  <div className="w-full sm:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      College Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="Enter your college name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                    />
                  </div>
                </div>

                {/* ABOUT (BIO) */}
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="about"
                  >
                    About
                  </label>
                  <div className="relative">
                    <PencilSquareIcon className="text-gray-400 absolute left-4.5 top-4 h-5 w-5" />
                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black 
                        focus:border-primary focus-visible:outline-none 
                        dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      name="about"
                      id="about"
                      rows={6}
                      placeholder="Write something about yourself..."
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                    ></textarea>
                  </div>
                </div>


                {/* ---- Feedback Messages ---- */}
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
              {showSuccess && successMessage && (
                <div
                  id="alert-additional-content-3"
                  className="mb-4 rounded-lg border border-[#065F46] bg-[#ECFDF5] p-4 text-[#065F46] dark:border-[#065F46] dark:bg-[#1F2937] dark:text-[#34D399]"
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
                    <h3 className="text-lg font-medium">Success: </h3>
                  </div>
                  <div className="mb-4 mt-2 text-sm">{successMessage}</div>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setShowSuccess(false)}
                      className="rounded-lg border border-[#ADF2D6] bg-transparent px-3 py-1.5 text-center text-xs font-medium text-[#065F46] hover:bg-[#065F46] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#6EE7B7] dark:border-[#13443F] dark:text-[#34D399] dark:hover:bg-[#059669] dark:hover:text-white dark:focus:ring-[#065F46]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}


                {/* SAVE BUTTONS */}
                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black 
                      hover:shadow-1 dark:border-strokedark dark:text-white"
                    type="button"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                    disabled={loading}
                  >{loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save"
                  )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* === PHOTO UPLOAD SECTION === */}
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Your Photo
              </h3>
            </div>

            <div className="p-7">
              {/* Photo Preview */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-full border border-stroke dark:border-strokedark">
                  {profilePic ? (
                    // If the user selected a new file, show local preview:
                    <Image
                      src={URL.createObjectURL(profilePic)}
                      alt="Preview"
                      width={56}
                      height={56}
                    />
                  ) : (
                    // Otherwise show existing user photo (from DB) or fallback
                    <Image
                      src={existingProfilePicUrl}
                      width={56}
                      height={56}
                      alt="User"
                    />
                  )}
                </div>
                <div>
                  <span className="mb-1.5 block text-black dark:text-white">
                    Edit your photo
                  </span>
                  <span className="flex gap-2.5">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 text-sm"
                      onClick={handleRemovePhoto}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="hover:text-blue-700 text-sm text-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Update
                    </button>
                  </span>
                </div>
              </div>

              {/* Upload Container */}
              <div
                id="FileUpload"
                className="relative mb-5.5 block w-full cursor-pointer appearance-none 
                  rounded border border-dashed border-primary bg-gray px-4 py-4 
                  text-center dark:bg-meta-4 sm:py-7.5"
              >
                <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-primary" />
                <p className="text-primary">Click to upload</p>
                <p className="mt-1.5">PNG or JPG (max, 800x800px)</p>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
