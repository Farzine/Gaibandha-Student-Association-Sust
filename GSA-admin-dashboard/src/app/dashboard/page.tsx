import MemberRequest from "@/components/Member/MemberRequest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Request | Gaibandha Students Association, SUST",
  description: "Member Request admin page of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
        <MemberRequest />
    </>
  );
}
