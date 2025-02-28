import Profile from "@/components/Dashboard-components/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile | Gaibandha Students Association, SUST",
  description: "User profile page of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
        <Profile />
    </>
  );
}