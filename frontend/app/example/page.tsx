
"use client"
import { FloatingDockDemo } from "@/components/Landingpage-components/FloatingDock";
import HeroVideoDialog from "@/components/Landingpage-components/HeroVideoDialog";
import { AnimatedCarousel } from "@/components/ui/animated-carousel";
import { BackgroundLines } from "@/components/ui/background-lines";
import GoogleTranslate from "@/components/ui/GoogleTranslate";
import { MorphingText } from "@/components/ui/morphing-text";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SparklesText } from "@/components/ui/sparkles-text";
import { TextAnimate } from "@/components/ui/text-animate";
import React from "react";

function Example() {

  const texts = ["Hello", "Morphing", "Text", "Animation", "React", "Component", "Smooth", "Transition", "Engaging"]
  const slides = [
    {
      id: 1,
      image: "/images/cards/cards-01.png",
      title: "Welcome to our platform",
      description: "Discover amazing features and services",
    },
    {
      id: 2,
      image: "/images/cards/cards-02.png",
      title: "Exclusive offers",
      description: "Check out our latest deals and promotions",
    },
    {
      id: 3,
      image: "/images/cards/cards-03.png",
      title: "Join our community",
      description: "Connect with like-minded individuals",
    },
    {
      id: 4,
      image: "/images/cards/cards-04.png",
      title: "Premium support",
      description: "We're here to help you every step of the way",
    },
  ];
  return (
    <div className="">
      <ScrollProgress className="top-[65px]" />

      <div className="mt-20">
        <HeroVideoDialog />
      </div>
      <div className="mt-28">
        <TextAnimate animation="blurInUp" by="character" once>
          Blur in by character
        </TextAnimate>
      </div>
      <div className="mt-28">
      <SparklesText text="Magic UI" />
      </div>
      <div className="mt-28">
      <MorphingText texts={texts} />
      </div>
      <div className="mt-28">
      <FloatingDockDemo />
      </div>
      <div className="mt-28 mx-50 mb-50">
      <GoogleTranslate />
      </div>

    </div>
  );
}

export default Example;
