
import { FloatingDockDemo } from "@/components/Landingpage-components/FloatingDock";
import HeroVideoDialog from "@/components/Landingpage-components/HeroVideoDialog";
import GoogleTranslate from "@/components/ui/GoogleTranslate";
import { MorphingText } from "@/components/ui/morphing-text";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SparklesText } from "@/components/ui/sparkles-text";
import { TextAnimate } from "@/components/ui/text-animate";
import React from "react";

function Example() {
  const texts = ["Hello", "Morphing", "Text", "Animation", "React", "Component", "Smooth", "Transition", "Engaging"]
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
