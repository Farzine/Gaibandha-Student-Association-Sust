import { Metadata } from "next";
import DefaultLayout from "@/components/Dashboard-components/Layouts/DefaultLayout";
import Profile from "./profile/page";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Profile/>
      </DefaultLayout>
    </>
  );
}
