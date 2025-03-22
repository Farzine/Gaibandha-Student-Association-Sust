
import Profile from "@/components/Landingpage-components/CategorizedMembers/ProfileCard";
import ProfileCard from "@/components/Landingpage-components/CategorizedMembers/ProfileInfoCard";
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
      <div className="mt-28 mx-20">
        <Profile user={{
          _id: "1",
          name: "Farzine",
          email: "farzine@gmail.com",
          department: "CSE",
          session: "2017-2018",
          bloodGroup: "A+",
          presentAddress: "Dhaka",
          permanentAddress: "Gaibandha",
          profession: "Software Engineer",
          facebookId: "https://www.facebook.com/farzine",
          linkedinId: "https://www.linkedin.com/farzine",
          about: "I am a software engineer and I love to code. I am a member of GSA, SUST. I am a proud member of GSA, SUST. I have enough knowledge to build a software. I am a software engineer and I love to code. I am a member of GSA, SUST. I am a proud member of GSA, SUST. I have enough knowledge to build a software. I am a software engineer and I love to code. I am a member of GSA, SUST. I am a proud member of GSA, SUST. I have enough knowledge to build a software.",
          religiousStatus: "Islam",
          profilePic: "/images/user/user-06.png",
          schoolName: "Dhaka College",
          collegeName: "Dhaka College",
          member: false,
          alumni: false,
          phone: "01700000000",
          designation: "Software Engineer",
          emailVerified: false,
          createdAt: "",
          updatedAt: ""
        }}/>
      </div>
    </div>
  );
}

export default Example;
