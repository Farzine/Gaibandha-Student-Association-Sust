"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, UserCheck, Calendar, Droplet, Book } from "lucide-react";
import OTPVerificationModal from "./OTPVerificationModal";
import { TextAnimate } from "@/components/ui/text-animate";
import { SparklesText } from "@/components/ui/sparkles-text";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    session: "",
    bloodGroup: "",
    religiousStatus: "",
    termsAccepted: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(true);

  // Handle change for text, select, and checkbox inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Check if all fields are filled and terms are accepted
  const isFormValid = Object.entries(formData).every(([key, value]) => {
    if (typeof value === "boolean") return value === true;
    return value.trim() !== "";
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setErrorMessage("Please fill out all fields and accept the terms.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department: formData.department,
            session: formData.session,
            bloodGroup: formData.bloodGroup,
            religiousStatus: formData.religiousStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage(data.message);
      setShowVerificationModal(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen px-4 py-16 pt-28 md:py-20 lg:py-28 lg:pt-[150px]">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full max-w-md lg:max-w-xl">
              {/* Card Container */}
              <div className="bg-white dark:bg-[#1f2937] rounded-xl shadow-lg overflow-hidden transition-all">
                {/* Header Section with Brand Colors */}
                <div className="mb-5 mt-5 text-center">
              <div className="relative mb-4">
              <SparklesText text="GSA-SUST"/>
              <div className="mt-4 flex items-center justify-center">
                <div className="to-[#60a5fa] h-1 w-16 rounded-full bg-gradient-to-r from-[#2563eb]"></div>
                <div className="bg-[#d1d5db] dark:bg-[#374151] mx-2 h-1 w-8 rounded-full"></div>
                <div className="bg-[#e5e7eb] dark:bg-[#374151] h-1 w-4 rounded-full"></div>
                </div>
                <div className="absolute left-1/2 top-1/2 -z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary opacity-10 blur-3xl"></div>
              </div>
              <TextAnimate
                animation="blurInUp"
                by="character"
                once
                className="text-lg text-[#4b5563] dark:text-[#d1d5db]"
              >
                Create your account to join our community
              </TextAnimate>
            </div>

                {/* Form Section */}
                <div className="px-6 py-8 sm:px-8 md:px-10">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Two-column layout for desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="relative">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb] mb-1"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User size={18} className="text-[#9ca3af]" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="pl-10 w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb] mb-1"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail size={18} className="text-[#9ca3af]" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="pl-10 w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="relative md:col-span-2">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb] mb-1"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock size={18} className="text-[#9ca3af]" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a secure password"
                            className="pl-10 w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
                            onFocus={() => setShowTooltip(true)}
                            onBlur={() => setShowTooltip(false)}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Eye size={18} className="text-gray-500" />
                            ) : (
                              <EyeOff size={18} className="text-gray-500" />
                            )}
                          </button>
                        </div>
                        {/* Password Requirements Tooltip */}
                        {showTooltip && (
                          <div className="absolute left-0 z-10 mt-1 w-full rounded-md bg-white p-3 text-xs shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-[#374151] dark:text-[#e5e7eb]">
                            <p className="font-semibold mb-1">Password requirements:</p>
                            <ul className="space-y-1 pl-4">
                              <li className="flex items-center">
                                <span className="text-[#22c55e] mr-1">✓</span> At least 6 characters
                              </li>
                              <li className="flex items-center">
                                <span className="text-[#22c55e] mr-1">✓</span> One uppercase letter
                              </li>
                              <li className="flex items-center">
                                <span className="text-[#22c55e] mr-1">✓</span> One lowercase letter
                              </li>
                              <li className="flex items-center">
                                <span className="text-[#22c55e] mr-1">✓</span> One number
                              </li>
                              <li className="flex items-center">
                                <span className="text-[#22c55e] mr-1">✓</span> One special character
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Department */}
                      <div className="relative">
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb] mb-1"
                        >
                          Department
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Book size={18} className="text-[#9ca3af]" />
                          </div>
                          <select
                            name="department"
                            id="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="pl-10 w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6] appearance-none"
                          >
                            <option value="" disabled>Select your department</option>
                            <option value="Anthropology">1. Anthropology</option>
                            <option value="Architecture">2. Architecture</option>
                            <option value="Bangla">3. Bangla</option>
                            <option value="Biochemistry & Molecular Biology">4. Biochemistry & Molecular Biology</option>
                            <option value="Business Administration">5. Business Administration</option>
                            <option value="Chemical Engineering & Polymer Science">6. Chemical Engineering & Polymer Science</option>
                            <option value="Chemistry">7. Chemistry</option>
                            <option value="Civil & Environmental Engineering">8. Civil & Environmental Engineering</option>
                            <option value="Computer Science & Engineering">9. Computer Science & Engineering</option>
                            <option value="Economics">10. Economics</option>
                            <option value="Electrical & Electronics Engineering">11. Electrical & Electronics Engineering</option>
                            <option value="English">12. English</option>
                            <option value="Food & Tea Technology">13. Food & Tea Technology</option>
                            <option value="Foresrty and Environmental Science">14. Foresrty and Environmental Science</option>
                            <option value="Genetic Engineering & Biotechnology">15. Genetic Engineering & Biotechnology</option>
                            <option value="Geography & Environmental Science">16. Geography & Environmental Science</option>
                            <option value="Industrial & Production Engineering">17. Industrial & Production Engineering</option>
                            <option value="Mathematics">18. Mathematics</option>
                            <option value="Petroleum & Mining Engineering">19. Petroleum & Mining Engineering</option>
                            <option value="Physics">20. Physics</option>
                            <option value="Political Studies">21. Political Studies</option>
                            <option value="Public Administration">22. Public Administration</option>
                            <option value="Social Work">23. Social Work</option>
                            <option value="Sociology">24. Sociology</option>
                            <option value="Software Engineering">25. Software Engineering</option>
                            <option value="Statistics">26. Statistics</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-4 w-4 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Session */}
                      <div className="relative">
                        <label
                          htmlFor="session"
                          className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb] mb-1"
                        >
                          Session
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar size={18} className="text-[#9ca3af]" />
                          </div>
                          <input
                            type="text"
                            name="session"
                            id="session"
                            value={formData.session}
                            onChange={handleChange}
                            placeholder="e.g., 2020-2021"
                            className="pl-10 w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
                          />
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div className="relative">
                        <label
                          htmlFor="bloodGroup"
                          className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb] mb-1"
                        >
                          Blood Group
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Droplet size={18} className="text-[#9ca3af]" />
                          </div>
                          <select
                            name="bloodGroup"
                            id="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            className="pl-10 w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6] appearance-none"
                          >
                            <option value="" disabled>Select blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-4 w-4 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Religious Status */}
                      <div className="relative">
                        <label
                          htmlFor="religiousStatus"
                          className="block text-sm font-medium text-[#374151] dark:text-[#e5e7eb] mb-1"
                        >
                          Religious Status
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <UserCheck size={18} className="text-[#9ca3af]" />
                          </div>
                          <select
                            name="religiousStatus"
                            id="religiousStatus"
                            value={formData.religiousStatus}
                            onChange={handleChange}
                            className="pl-10 w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6] appearance-none"
                          >
                            <option value="" disabled>Select religious status</option>
                            <option value="Muslim">Muslim</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Christian">Christian</option>
                            <option value="Buddhist">Buddhist</option>
                            <option value="Other">Other</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-4 w-4 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mt-6">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="termsAccepted"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-[#d1d5db] text-[#2563eb] focus:ring-[#3b82f6] mt-0.5 dark:border-[#4b5563] dark:bg-[#374151]"
                        />
                        <label
                          htmlFor="termsAccepted"
                          className="ml-2 block text-sm text-[#4b5563] dark:text-[#d1d5db]"
                        >
                          By creating an account, you agree to the{" "}
                          <a href="#0" className="text-[#2563eb] hover:underline dark:text-blue-400">
                            Terms and Conditions
                          </a>{" "}
                          and our{" "}
                          <a href="#0" className="text-[#2563eb] hover:underline dark:text-blue-400">
                            Privacy Policy
                          </a>
                          .
                        </label>
                      </div>
                    </div>

                    {/* Error/Success Messages */}
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
                        <h3 className="text-lg font-medium">
                          Error occurred:{" "}
                        </h3>
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

                    {/* Submit Button */}
                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-white bg-[#2563eb] hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] transition-colors ${
                          (!isFormValid || loading) && "opacity-60 cursor-not-allowed"
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating your account...
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Sign In Link */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-[#4b5563] dark:text-[#d1d5db]">
                      Already a member?{" "}
                      <Link href="/signin" className="text-[#2563eb] hover:underline font-medium dark:text-blue-400">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showVerificationModal}
        email={formData.email}
        onClose={() => setShowVerificationModal(false)}
      />
    </>
  );
};

export default SignupPage;