import YoutubeThumbnailManager from "@/components/YoutubeVideo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Youtube Video | Gaibandha Students Association, SUST",
  description:
    "Youtube Video admin page of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
      <YoutubeThumbnailManager />
    </>
  );
}


