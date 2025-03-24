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

  // Handle paste event for OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    // Check if pasted content matches expected format
    if (/^\d+$/.test(pastedData) && pastedData.length <= otp.length) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < otp.length) {
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty input or the last one if all filled
      const nextEmptyIndex = digits.length < otp.length ? digits.length : otp.length - 1;
      if (inputRefs.current[nextEmptyIndex]) {
        inputRefs.current[nextEmptyIndex].focus();
      }
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

  // Handle key down events for navigation between inputs
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1f2937] rounded-xl shadow-2xl overflow-hidden transition-all transform animate-fadeIn">
        <div className="relative">
          {/* Header with decorative accent */}
          <div className="h-2 bg-gradient-to-r from-[#3b82f6] to-[#9333ea]"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#4b5563] dark:hover:text-[#e5e7eb] transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-[#eff6ff] dark:bg-[#dbeafe] rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1f2937] dark:text-white">
              Verify Your Account
            </h2>
            <p className="text-[#4b5563] dark:text-[#d1d5db] text-center mt-2">
              We sent a verification code to{" "}
              <span className="font-medium text-primary">{email}</span>
            </p>
          </div>

          {/* Timer indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6b7280] dark:text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeLeft > 0 ? (
                <span className="text-sm font-medium text-[#4b5563] dark:text-[#d1d5db]">
                  Code expires in <span className="text-primary font-bold">{formatTime(timeLeft)}</span>
                </span>
              ) : (
                <span className="text-sm font-medium text-[#ef4444]">
                  Code expired. Please request a new one.
                </span>
              )}
            </div>
            <div className="w-full bg-[#e5e7eb] dark:bg-[#374151] rounded-full h-1.5 mt-2">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 300) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#fef2f2] dark:bg-[#fee2e2] border border-[#fecaca] dark:border-[#991b1b] flex items-start">
              <svg className="h-5 w-5 text-[#ef4444] mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-[#991b1b] dark:text-[#991b1b]">Error</h3>
                <p className="mt-1 text-sm text-[#b91c1c] dark:text-[#f87171]">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-[#dcfce7] border border-[#bbf7d0] dark:border-[#166534] flex items-start">
              <svg className="h-5 w-5 text-[#22c55e] mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-[#166534] dark:text-[#166534]">Success</h3>
                <p className="mt-1 text-sm text-[#15803d] dark:text-[#4ade80]">{success}</p>
              </div>
            </div>
          )}

          {/* OTP input field */}
          <div className="mb-6">
            <label htmlFor="otp-input" className="block text-sm font-medium text-[#374151] dark:text-[#d1d5db] mb-2">
              Enter verification code
            </label>
            <div 
              className="flex justify-center gap-2 md:gap-3" 
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el!)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 md:w-12 md:h-14 rounded-lg border-2 text-center text-xl font-bold text-[#1f2937] dark:text-white focus:border-primary focus:ring focus:ring-primary/20 dark:focus:ring-primary/40 dark:bg-[#374151] dark:border-[#4b5563] transition-all duration-200"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 focus:ring-4 focus:ring-primary/20 dark:focus:ring-primary/40 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </button>

          {/* Resend option */}
          <div className="mt-5 text-center">
            <p className="text-sm text-[#4b5563] dark:text-[#9ca3af]">
              Didn&apos;t receive the code?{" "}
              <button
                onClick={handleResendCode}
                disabled={timeLeft > 270} // Disable resend for 30 seconds after sending
                className={`font-medium text-primary hover:text-primary/80 transition-colors ${
                  timeLeft > 270 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {timeLeft > 270 ? `Resend in ${formatTime(timeLeft - 270)}` : "Resend code"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}