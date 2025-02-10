import AboutSectionOne from "@/components/Landingpage-components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/Landingpage-components/About/AboutSectionTwo";
import Blog from "@/components/Landingpage-components/Blog";
import Brands from "@/components/Landingpage-components/Brands";
import {
  default as Hero,
  default as ScrollUp,
} from "@/components/Landingpage-components/Common/ScrollUp";
import Contact from "@/components/Landingpage-components/Contact";
import Features from "@/components/Landingpage-components/Features";
import Pricing from "@/components/Landingpage-components/Pricing";
import Testimonials from "@/components/Landingpage-components/Testimonials";
import Video from "@/components/Landingpage-components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Next.js Template for Startup and SaaS",
  description: "This is Home for Startup Nextjs Template",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <Video />
      <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact />
    </>
  );
}
