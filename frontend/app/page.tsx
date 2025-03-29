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
import HeroImage from "@/components/Landingpage-components/HeroImage";
import MessagesDisplay from "@/components/Landingpage-components/Message";
import { NoticeMarquee } from "@/components/Landingpage-components/NoticeMarquee";
import Pricing from "@/components/Landingpage-components/Pricing";
import Testimonials from "@/components/Landingpage-components/Testimonials";
import Video from "@/components/Landingpage-components/Video";
import { BackgroundLines } from "@/components/ui/background-lines";
import HeroSection from "@/components/ui/heroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Next.js Template for Startup and SaaS",
  description: "This is Home for Startup Nextjs Template",
  // other metadata
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollUp />
      
      {/* Hero Section with Carousel */}
      
      <section className="w-full">
      <HeroSection />
      <HeroImage />
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
        <div>

        </div>
      </BackgroundLines>
      </section>
      
      {/* Main Content */}
      <main className="flex-grow">
      <NoticeMarquee/>
      <MessagesDisplay/>
      <Features />
      <Video />
      <div className="container mx-auto px-4 md:px-8">
        <Brands />
        <AboutSectionOne />
        <AboutSectionTwo />
        <Testimonials />
        <Pricing />
        <Blog />
      </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full">
      <Contact />
      </footer>
      
      <Hero />
    </div>
  );
}
