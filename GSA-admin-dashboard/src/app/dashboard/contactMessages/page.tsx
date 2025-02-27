import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Messages | Gaibandha Students Association, SUST",
  description:
    "Contact Messages admin page of Gaibandha Students Association, SUST",
};

import ContactMessagesDashboard from "@/components/ContactMessagesDashboard";

export default function Home() {
  return (
    <>
        <ContactMessagesDashboard  />
    </>
  );
}