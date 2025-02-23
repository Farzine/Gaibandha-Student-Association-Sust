import { Metadata } from "next";
import Notice from "@/components/Notice";

export const metadata: Metadata = {
  title: "Notice | Gaibandha Students Association, SUST",
  description: "Notice admin page of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
      <Notice />
    </>
  );
}