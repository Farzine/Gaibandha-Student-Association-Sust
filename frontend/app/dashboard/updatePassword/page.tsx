import UpdatePasswordPage from "@/components/Dashboard-components/updatePassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Password | Gaibandha Students Association, SUST",
  description: "Update user password page of Gaibandha Students Association, SUST",
};

export default function UpdatePassword() {
  return (
    <>
        <UpdatePasswordPage />
    </>
  );
}