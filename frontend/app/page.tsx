import {
  default as Hero,
  default as ScrollUp,
} from "@/components/Landingpage-components/Common/ScrollUp";
import HeroImage from "@/components/Landingpage-components/HeroImage";
import MessagesDisplay from "@/components/Landingpage-components/Message";
import { NoticeMarquee } from "@/components/Landingpage-components/NoticeMarquee";
import Testimonials from "@/components/Landingpage-components/Testimonials";
import Video from "@/components/Landingpage-components/Video";
import { BackgroundLines } from "@/components/ui/background-lines";
import HeroSection from "@/components/ui/heroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page | Gaibandha Student Association, SUST",
  description: "This is Home Page for Gaibandha Student Association, SUST",
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
        <NoticeMarquee />
        <MessagesDisplay />
        <Video />
        <Testimonials />
      </main>

      {/* Footer */}
      <footer className="w-full"></footer>

      <Hero />
    </div>
  );
}
