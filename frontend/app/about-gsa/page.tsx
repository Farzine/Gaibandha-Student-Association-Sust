import Breadcrumb from "@/components/Landingpage-components/Common/Breadcrumb";


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GSA-SUST | Gaibandha Students Association, SUST",
  description: "This is About Page of GSA-SUST for Gaibandha Students Association, SUST-website", 
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About GSA-SUST Page"
      />
      
    </>
  );
};

export default AboutPage;
