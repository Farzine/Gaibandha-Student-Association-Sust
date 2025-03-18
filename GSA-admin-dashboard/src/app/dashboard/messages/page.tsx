import MessagesPage from "@/components/Messages/MessagesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Gaibandha Students Association, SUST",
  description: "Messages admin page of Gaibandha Students Association, SUST",
};

export default function Messages() {
  return (
    <>
      <MessagesPage />
    </>
  );
}
