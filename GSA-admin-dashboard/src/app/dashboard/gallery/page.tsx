import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Gaibandha Students Association, SUST",
  description:
    "Gallery admin page of Gaibandha Students Association, SUST",
};

import GalleryPage from "@/components/GalleryPage";

export default function Home() {
  return (
    <>
        <GalleryPage />
    </>
  );
}