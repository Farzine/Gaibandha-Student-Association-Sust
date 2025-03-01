
import Settings from "@/components/Dashboard-components/Setting";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Gaibandha Students Association, SUST",
  description: "User profile update page of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
        <Settings />
    </>
  );
}