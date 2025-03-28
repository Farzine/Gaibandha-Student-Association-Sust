import Breadcrumb from "@/components/Landingpage-components/Common/Breadcrumb";


import { Metadata } from "next";
import HistoryOfGaibandha from "@/components/Landingpage-components/About/About";

export const metadata: Metadata = {
  title: "About Gaibandha | Gaibandha Students Association, SUST",
  description: "This is About Page of Gaibandha District for Gaibandha Students Association, SUST", 
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Gaibandha Page"
      />
      <HistoryOfGaibandha />
    </>
  );
};

export default AboutPage;
