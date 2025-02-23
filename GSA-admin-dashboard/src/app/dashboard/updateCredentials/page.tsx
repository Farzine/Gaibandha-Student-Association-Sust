import { Metadata } from "next";
import UpdateCredentials from "@/components/UpdateAdminCredentials";


export const metadata: Metadata = {
  title: "Update Credentials | Gaibandha Students Association, SUST",
  description: "Update admin credentials of Gaibandha Students Association, SUST",
};

export default function Home() {
  return (
    <>
      <UpdateCredentials />
    </>
  );
}