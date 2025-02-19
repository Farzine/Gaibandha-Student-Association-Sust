"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import OTPVerificationModal from "./OTPVerificationModal";

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
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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
      // Optionally, you can redirect the user to a verification page:
      // router.push("/verify-email");
      setShowVerificationModal(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded bg-white px-6 py-10 shadow-three dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Create your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  It’s totally free and super easy
                </p>
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-8">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  {/* Email */}
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your Email"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  {/* Password */}
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Password
                    </label>
                    <div className="relative">
                      {/* Tooltip for Password Requirements */}
                      {showTooltip && (
                        <div className="text-gray-700 dark:bg-gray-800 dark:text-gray-300 absolute left-0 top-full mt-2 w-[280px] rounded-lg bg-white p-3 text-sm shadow-md dark:bg-[#1D2430]">
                          <p className="mb-1 font-medium">
                            Password must contain:
                          </p>
                          <ul className="list-inside list-disc space-y-1">
                            <li>✅ At least 6 characters long</li>
                            <li>✅ One uppercase letter (A-Z)</li>
                            <li>✅ One lowercase letter (a-z)</li>
                            <li>✅ One number (0-9)</li>
                            <li>✅ One special character</li>
                          </ul>
                        </div>
                      )}
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your Password"
                        className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                        onFocus={() => setShowTooltip(true)}
                        onBlur={() => setShowTooltip(false)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-4 right-4 flex items-center"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye
                            size={20}
                            className="text-body-color dark:text-body-color-dark "
                          />
                        ) : (
                          <EyeOff
                            size={20}
                            className="text-body-color dark:text-body-color-dark "
                          />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Department */}
                  <div className="mb-8">
                    <label
                      htmlFor="department"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none h-5/6"
                    >
                      <option
                        value=""
                        className="bg-[#5C7AF8] text-white dark:border-transparent dark:bg-[#5C7AF8] dark:text-white dark:shadow-two"
                        disabled
                      >
                        Select your department
                      </option>
                      <option value="Anthropology">1. Anthropology</option>
                      <option value="Architecture">2. Architecture</option>
                      <option value="Bangla">3. Bangla</option>
                      <option value="Biochemistry & Molecular Biology">
                        4. Biochemistry & Molecular Biology
                      </option>
                      <option value="Business Administration">
                        5. Business Administration
                      </option>
                      <option value="Chemical Engineering & Polymer Science">
                        6. Chemical Engineering & Polymer Science
                      </option>
                      <option value="Chemistry">7. Chemistry</option>
                      <option value="Civil & Environmental Engineering">
                        8. Civil & Environmental Engineering
                      </option>
                      <option value="Computer Science & Engineering">
                        9. Computer Science & Engineering
                      </option>
                      <option value="Economics">10. Economics</option>
                      <option value="Electrical & Electronics Engineering">
                        11. Electrical & Electronics Engineering
                      </option>
                      <option value="English">12. English</option>
                      <option value="Food & Tea Technology">
                        13. Food & Tea Technology
                      </option>
                      <option value="Foresrty and Environmental Science">
                        14. Foresrty and Environmental Science
                      </option>
                      <option value="Genetic Engineering & Biotechnology">
                        15. Genetic Engineering & Biotechnology
                      </option>
                      <option value="Geography & Environment">
                        16. Geography & Environment
                      </option>
                      <option value="Industrial & Production Engineering">
                        17. Industrial & Production Engineering
                      </option>
                      <option value="Mathematics">18. Mathematics</option>
                      <option value="Petroleum & Georesources Engineering">
                        19. Petroleum & Georesources Engineering
                      </option>
                      <option value="Physics">20. Physics</option>
                      <option value="Political Studies">
                        21. Political Studies
                      </option>
                      <option value="Public Administration">
                        22. Public Administration
                      </option>
                      <option value="Social Work">23. Social Work</option>
                      <option value="Sociology">24. Sociology</option>
                      <option value="Software Engineering">
                        25. Software Engineering
                      </option>
                      <option value="Statistics">26. Statistics</option>
                    </select>
                  </div>
                  {/* Session */}
                  <div className="mb-8">
                    <label
                      htmlFor="session"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Session
                    </label>
                    <input
                      type="text"
                      name="session"
                      value={formData.session}
                      onChange={handleChange}
                      placeholder="Enter your session (e.g., 2020-2021)"
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  {/* Blood Group */}
                  <div className="mb-8">
                    <label
                      htmlFor="bloodGroup"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option
                        value=""
                        className="bg-[#5C7AF8] text-white dark:border-transparent dark:bg-[#5C7AF8] dark:text-white dark:shadow-two"
                        disabled
                      >
                        Select your blood group
                      </option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  {/* Religious Status */}
                  <div className="mb-8">
                    <label
                      htmlFor="religiousStatus"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Religious Status
                    </label>
                    <select
                      name="religiousStatus"
                      value={formData.religiousStatus}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                    >
                      <option
                        value=""
                        className="bg-[#5C7AF8] text-white dark:border-transparent dark:bg-[#5C7AF8] dark:text-white dark:shadow-two"
                        disabled
                      >
                        Select your religious status
                      </option>
                      <option value="Muslim">Muslim</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Christian">Christian</option>
                      <option value="Buddhist">Buddhist</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {/* Terms and Conditions */}
                  <div className="mb-8 flex">
                    <label
                      htmlFor="termsAccepted"
                      className="flex cursor-pointer items-center text-sm font-medium text-body-color"
                    >
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border border-body-color border-opacity-20 accent-primary dark:border-white dark:border-opacity-10"
                      />
                      <span className="ml-3">
                        By creating an account, you agree to the
                        <a href="#0" className="text-primary hover:underline">
                          {" "}
                          Terms and Conditions{" "}
                        </a>
                        and our
                        <a href="#0" className="text-primary hover:underline">
                          {" "}
                          Privacy Policy{" "}
                        </a>
                        .
                      </span>
                    </label>
                  </div>
                  {/* Display error or success messages */}
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

                  {/* Submit button */}
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={!isFormValid || loading}
                      className={`flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark ${
                        (!isFormValid || loading) &&
                        "cursor-not-allowed opacity-50"
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Signing up...</span>
                        </div>
                      ) : (
                        "Sign up"
                      )}
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Already a member?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
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
      {/* --- Import and render the OTP Verification Modal --- */}
      <OTPVerificationModal
        isOpen={showVerificationModal}
        email={formData.email}
        onClose={() => setShowVerificationModal(false)}
      />
    </>
  );
};

export default SignupPage;
