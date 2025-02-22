import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorize Member Details | Gaibandha Students Association, SUST",
  description:
    "Categorize Member Details admin page of Gaibandha Students Association, SUST",
};


import CategorizedMembersPage from "@/components/CategorizedMembersPage";

export default function Home() {
  return (
    <>
        <CategorizedMembersPage />
    </>
  );
}