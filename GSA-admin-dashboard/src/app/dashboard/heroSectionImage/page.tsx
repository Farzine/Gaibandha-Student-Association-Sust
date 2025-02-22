import { Metadata } from "next";
import HeroSectionImage from "@/components/HeroSectionImage";

export const metadata: Metadata = {
  title: "Hero Section Image | Gaibandha Students Association, SUST",
  description:
    "Hero Section Image admin page of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
      <HeroSectionImage />
    </>
  );
}


