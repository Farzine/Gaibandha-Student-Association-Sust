"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OTPVerificationModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

export default function OTPVerificationModal({
  isOpen,
  email,
  onClose,
}: OTPVerificationModalProps) {
  // Adjust the number of digits here (e.g., 6 digits)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer state in seconds (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  // When modal opens, reset the timer to 300 seconds
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  // Format the time as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // If modal not open, render nothing
  if (!isOpen) return null;

  // Handle digit input
  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input if current is filled
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Verify the OTP
  const handleVerifyOTP = async () => {
    setError("");
    setSuccess("");

    const code = otp.join(""); // Combine all digits
    if (code.length < otp.length) {
      setError("Please enter all digits of the verification code.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: code }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid code or verification error");
      }

      setSuccess("Your email has been verified successfully!");
      // router.push("/dashboard");

      // Option 2: show success briefly, then redirect
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend the OTP code
  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/resend-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }
      setSuccess("Verification code resent. Please check your email.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      {/* Modal Content */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-dark">
        {/* Optional close button (if you want a manual close) */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 float-right"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="mb-2 text-center text-xl font-bold dark:text-white">
          Verify Your Account
        </h2>
        <p className="text-gray-700 mb-4 text-center text-sm dark:text-body-color-dark">
          We sent a verification code to{" "}
          <strong className="text-primary">{email}</strong>.
          <br />
          Please check your email and enter the code below.
        </p>
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

        {/* OTP Inputs */}
        <div className="mb-6 flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el!)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(e, index)}
              className="border-gray-300 dark:border-gray-600 h-12 w-10 rounded-md border text-center text-xl focus:border-primary focus:outline-none dark:bg-[#2C303B] dark:text-white"
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOTP}
          className="mb-3 flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            "VERIFY"
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
      </div>
    </div>
  );
}
