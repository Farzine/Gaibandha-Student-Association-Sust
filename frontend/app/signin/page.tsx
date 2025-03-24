"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import ForgotPasswordModal from "./ForgotPasswordModalProps";
import Breadcrumb from "@/components/Landingpage-components/Common/Breadcrumb";
import { TextAnimate } from "@/components/ui/text-animate";
import { SparklesText } from "@/components/ui/sparkles-text";

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Handle change for text
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if all fields are filled
  const isFormValid = Object.entries(formData).every(([key, value]) => {
    return value.trim() !== "";
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setErrorMessage("Please fill out email and password fields.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();
      const userData = data.userData;
      // save the user data in the local storage
      localStorage.setItem("userData", JSON.stringify(userData));

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        Cookie.set("token", data.token, { expires: 7 });
      }

      setSuccessMessage(data.message);
      // Optionally, you can redirect the user to a verification page:
      router.push("/dashboard");
      // setShowVerificationModal(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Sign in" />
      <section className="relative z-10 mb-20 overflow-hidden">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded-lg bg-white px-6 shadow-three dark:bg-dark sm:p-[10px]">
                {/* Header Section with Brand Colors */}
                <div className="mb-5 text-center">
                  <div className="relative mb-5">
                    <SparklesText text="GSA-SUST" />
                    <div className="mt-4 flex items-center justify-center">
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa]"></div>
                      <div className="mx-2 h-1 w-8 rounded-full bg-[#d1d5db] dark:bg-[#374151]"></div>
                      <div className="h-1 w-4 rounded-full bg-[#e5e7eb] dark:bg-[#374151]"></div>
                    </div>
                    <div className="absolute left-1/2 top-1/2 -z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary opacity-10 blur-3xl"></div>
                  </div>
                  <TextAnimate
                    animation="blurInUp"
                    by="character"
                    once
                    className="text-lg text-[#4b5563] dark:text-[#d1d5db]"
                  >
                    Sign in to your account for GSA-SUST
                  </TextAnimate>
                </div>
                <form onSubmit={handleSubmit} className="lg:mx-10 ">
                  <div className="relative mb-4">
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]"
                    >
                      Email Address
                    </label>
                    <div className="relative my-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail size={18} className="text-[#9ca3af]" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pl-10 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
                      />
                    </div>
                  </div>

                  <div className="relative my-2">
                    <label
                      htmlFor="password"
                      className="mb-1 block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]"
                    >
                      Password
                    </label>
                    <div className="relative my-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock size={18} className="text-[#9ca3af]" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a secure password"
                        className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pl-10 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
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
                  </div>
                  <div className="mb-8 flex flex-col justify-end sm:flex-row sm:items-center">
                    <div>
                      <Link
                        href="#0"
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowVerificationModal(true);
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
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

                  {/* Signin button */}
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
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Don&apos;t you have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ForgotPasswordModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
    </>
  );
};

export default SigninPage;
