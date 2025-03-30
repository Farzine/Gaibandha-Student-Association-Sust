"use client";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import Breadcrumb from "@/components/Dashboard-components/Breadcrumbs/Breadcrumb";

const UpdatePasswordPage = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmedNewPassword: "",
    });
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            setErrorMessage("Please fill all the fields");
            setShowError(true);
            return;
        }

        if (formData.newPassword !== formData.confirmedNewPassword) {
            setErrorMessage("New passwords do not match");
            setShowError(true);
            return;
        }

        setErrorMessage("");
        setLoading(true);

        const token = Cookie.get("token");
        if (!token) {
            setErrorMessage("You are not authorized to perform this action");
            setShowError(true);
            setLoading(false);
            return router.push("/signin");
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/user/update-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        oldPassword: formData.oldPassword,
                        newPassword: formData.newPassword,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Update failed");
                setShowError(true);
                throw new Error(data.message || "Update failed");
            }

            setSuccessMessage(data.message || "Password updated successfully");
            setShowSuccess(true);
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmedNewPassword: "",
            });
        } catch (err: any) {
            setErrorMessage(err.message);
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Breadcrumb pageName="Update Password" />
            <section className="relative z-10 mb-20 overflow-hidden pb-8">
                <div className="container">
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4">
                            <div className="mx-auto max-w-[500px] rounded-lg bg-white px-6 py-8 shadow-three dark:bg-dark sm:p-[60px]">
                                <h2 className="mb-8 text-center text-2xl font-bold text-black dark:text-white">
                                    Change Your Password
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    {/* Old Password Field */}
                                    <div className="relative mb-5">
                                        <label
                                            htmlFor="oldPassword"
                                            className="mb-1 block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]"
                                        >
                                            Current Password
                                        </label>
                                        <div className="relative my-2">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Lock size={18} className="text-[#9ca3af]" />
                                            </div>
                                            <input
                                                type={showOldPassword ? "text" : "password"}
                                                name="oldPassword"
                                                id="oldPassword"
                                                value={formData.oldPassword}
                                                onChange={handleChange}
                                                placeholder="Enter your current password"
                                                className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pl-10 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                            >
                                                {showOldPassword ? (
                                                    <Eye size={18} className="text-gray-500" />
                                                ) : (
                                                    <EyeOff size={18} className="text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password Field */}
                                    <div className="relative mb-5">
                                        <label
                                            htmlFor="newPassword"
                                            className="mb-1 block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]"
                                        >
                                            New Password
                                        </label>
                                        <div className="relative my-2">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Lock size={18} className="text-[#9ca3af]" />
                                            </div>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                name="newPassword"
                                                id="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Create a new password"
                                                className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pl-10 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? (
                                                    <Eye size={18} className="text-gray-500" />
                                                ) : (
                                                    <EyeOff size={18} className="text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm New Password Field */}
                                    <div className="relative mb-6">
                                        <label
                                            htmlFor="confirmedNewPassword"
                                            className="mb-1 block text-sm font-medium text-[#374151] dark:text-[#e5e7eb]"
                                        >
                                            Confirm New Password
                                        </label>
                                        <div className="relative my-2">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Lock size={18} className="text-[#9ca3af]" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmedNewPassword"
                                                id="confirmedNewPassword"
                                                value={formData.confirmedNewPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm your new password"
                                                className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pl-10 text-sm text-[#374151] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 dark:border-[#4b5563] dark:bg-[#374151] dark:text-white dark:placeholder-[#9ca3af] dark:focus:border-[#3b82f6]"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <Eye size={18} className="text-gray-500" />
                                                ) : (
                                                    <EyeOff size={18} className="text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display error or success messages */}
                                    {showError && errorMessage && (
                                        <div
                                            className="mb-5 rounded-lg border border-danger bg-[#FEF2F2] p-4 text-[#F87171] dark:border-danger dark:bg-[#1F2937] dark:text-[#F87171]"
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
                                                <h3 className="text-lg font-medium">Error:</h3>
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
                                            className="mb-5 rounded-lg border border-[#065F46] bg-[#ECFDF5] p-4 text-[#065F46] dark:border-[#065F46] dark:bg-[#1F2937] dark:text-[#34D399]"
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
                                                <h3 className="text-lg font-medium">Success:</h3>
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

                                    {/* Update Password button */}
                                    <div className="mb-2">
                                        <button
                                            type="submit"
                                            disabled={!isFormValid || loading}
                                            className={`flex w-full items-center justify-center rounded-lg bg-primary px-9 py-3.5 text-base font-medium text-white shadow-submit transition duration-300 hover:bg-primary/90 dark:shadow-submit-dark ${
                                                (!isFormValid || loading) &&
                                                "cursor-not-allowed opacity-50"
                                            }`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                    <span>Updating...</span>
                                                </div>
                                            ) : (
                                                "Update Password"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UpdatePasswordPage;
