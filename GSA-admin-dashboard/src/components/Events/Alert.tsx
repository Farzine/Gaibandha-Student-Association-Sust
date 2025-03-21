// Alert.tsx
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from "react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const baseClasses =
    "flex items-center justify-between p-4 rounded-lg shadow-md";

  const typeClasses =
    type === "success"
      ? "bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]"
      : "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]";

  return (
    <div className={`${baseClasses} ${typeClasses} mb-4`}>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="text-[#6b7280] hover:text-[#374151] transition-colors"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Alert;
