import Breadcrumb from "@/components/Landingpage-components/Common/Breadcrumb";
import AboutSectionOne from "@/components/Landingpage-components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/Landingpage-components/About/AboutSectionTwo";

import { Metadata } from "next";

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
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
