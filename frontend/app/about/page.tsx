import Breadcrumb from "@/components/Landingpage-components/Common/Breadcrumb";


import { Metadata } from "next";
import HistoryOfGaibandha from "@/components/Landingpage-components/About/About";

export const metadata: Metadata = {
  title: "About Page | Free Next.js Template for Startup and SaaS",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Page"
      />
      <HistoryOfGaibandha />
    </>
  );
};

export default AboutPage;
