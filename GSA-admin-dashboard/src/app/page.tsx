import { Metadata } from "next";
import SignIn from "../components/signin";

export const metadata: Metadata = {
  title: "SignIn Page | Gaibandha Students Association, SUST",
  description: "Sign in to Admin page of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
      <SignIn />
    </>
  );
}
