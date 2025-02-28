import { Metadata } from "next";
import Profile from "./profile/page";

export const metadata: Metadata = {
  title: "User Profile | Gaibandha Students Association, SUST",
  description: "User profile page of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
        <Profile/>
    </>
  );
}
