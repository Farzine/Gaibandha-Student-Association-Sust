"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Eye, EyeOff } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  // Steps: 1 = email input, 2 = reset password form
  const [step, setStep] = useState(1);

  // Common states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer state in seconds (10 minutes = 600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);

  // Step 1: Email state
  const [email, setEmail] = useState("");

  // Step 2: Reset password states
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // When modal opens, reset the timer to 300 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isOpen && step === 2) {
      setTimeLeft(600);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, step]);

  // Format the time as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle email submission in step 1
  const handleEmailSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error sending reset password code.");
      }
      setSuccess("A reset code has been sent to your email.");
      // Move to step 2 after a brief moment
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset in step 2
  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!otp || !newPassword || !confirmPassword) {
      setError("Please fill in all the fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Optional: Client-side password strength check
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      setError(
        "Password must contain uppercase, lowercase, number, special character, and be at least 6 characters long.",
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error resetting password.");
      }
      setSuccess(
        "Password has been reset successfully! Redirecting to login...",
      );
      setTimeout(() => {
        router.push("/signin");
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code
  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/resend-code-for-reset-Password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code.");
      }
      setSuccess("Verification code resent. Please check your email.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  // Only render the modal on client-side and when open
  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-5">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-dark">
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 float-right"
          aria-label="Close"
        >
          &times;
        </button>

        {step === 1 && (
          <>
            <h2 className="mb-4 text-center text-xl font-bold dark:text-white">
              Forgot Password
            </h2>
            <p className="text-gray-700 mb-4 text-center text-sm dark:text-body-color-dark">
              Enter your registered email address to receive a password reset
              code.
            </p>

            {/* Display Error / Success Messages */}
            {error && (
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
                <div className="mb-4 mt-2 text-sm">{error}</div>
              </div>
            )}
            {success && (
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
                <div className="mb-4 mt-2 text-sm">{success}</div>
              </div>
            )}

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 dark:border-gray-600 mb-4 w-full rounded-md border p-3 focus:border-primary focus:outline-none dark:bg-[#2C303B] dark:text-white"
            />

            <button
              onClick={handleEmailSubmit}
              className="mb-4 w-full rounded-sm bg-primary px-4 py-3 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="relative">
              <h2 className="mb-4 text-center text-xl font-bold dark:text-white">
                Forgot Password
              </h2>
              {/* Timer Message */}
              <div className="text-gray-600 dark:text-gray-400 mb-4 text-center text-sm font-medium">
                {timeLeft > 0 ? (
                  <>
                    OTP expires in:{" "}
                    <span className="font-bold">{formatTime(timeLeft)}</span>
                  </>
                ) : (
                  <span className="text-red-500 font-bold">
                    OTP expired. Please resend the code.
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-700 mb-4 text-center text-sm dark:text-body-color-dark">
              Enter the verification code sent to your email and set your new
              password.
            </p>

            {/* Email (readonly) */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              disabled
              className="border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 mb-4 w-full rounded-md border p-3 dark:bg-[#2C303B] dark:text-white"
            />

            {/* OTP Input */}
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border-gray-300 dark:border-gray-600 mb-4 w-full rounded-md border p-3 focus:border-primary focus:outline-none dark:bg-[#2C303B] dark:text-white"
            />

            {/* New Password */}
            <div className="relative">
              {/* Tooltip for Password Requirements */}
              {showTooltip && (
                <div className="text-gray-700 dark:bg-gray-800 dark:text-gray-300 absolute left-0 top-full z-10 w-[280px] rounded-lg bg-white p-3 text-sm shadow-md dark:bg-[#1D2430]">
                  <p className="mb-1 font-medium">Password must contain:</p>
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="border-gray-300 dark:border-gray-600 mb-4 w-full rounded-md border p-3 focus:border-primary focus:outline-none dark:bg-[#2C303B] dark:text-white"
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
              />
              <button
                type="button"
                className="absolute inset-y-4 right-4 mb-5 flex items-center"
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

            {/* Confirm New Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="border-gray-300 dark:border-gray-600 mb-4 w-full rounded-md border p-3 focus:border-primary focus:outline-none dark:bg-[#2C303B] dark:text-white"
              />
              <button
                type="button"
                className="absolute inset-y-4 right-4 mb-5 flex items-center"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
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

            {/* Display Error / Success Messages */}
            {error && (
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
                <div className="mb-4 mt-2 text-sm">{error}</div>
              </div>
            )}
            {success && (
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
                <div className="mb-4 mt-2 text-sm">{success}</div>
              </div>
            )}

            {/* Reset Password Button */}
            <button
              onClick={handleResetPassword}
              className="mb-4 w-full rounded-sm bg-primary px-4 py-3 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-gray-600 dark:text-gray-400 text-center text-sm">
              Didn’t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="font-semibold text-primary hover:underline"
              >
                Resend
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
  );
}
