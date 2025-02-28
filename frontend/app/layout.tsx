"use client";

import Footer from "@/components/Landingpage-components/Footer";
import Header from "@/components/Landingpage-components/Header";
import ScrollToTop from "@/components/Landingpage-components/ScrollToTop";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeaderFooter = !pathname.startsWith("/dashboard");
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
        {showHeaderFooter && <Header />}
          {children}
          {showHeaderFooter && <Footer />}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
