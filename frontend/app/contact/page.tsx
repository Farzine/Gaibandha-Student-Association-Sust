import Contact from "@/components/Landingpage-components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | Gaibandha Students Association, SUST",
  description: "This is Contact Page for Gaibandha Students Association, SUST",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Contact />
    </>
  );
};

export default ContactPage;
