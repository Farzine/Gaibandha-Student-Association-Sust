import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CosmicBackground from "../components/ui/CosmicBackground";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Gaibandha Student Association, SUST",
  description: "Gaibandha Student Association, SUST is a non-profit organization of the students of Shahjalal University of Science and Technology (SUST) who are from Gaibandha district. The organization was established in 2012 with the aim of bringing together the students of Gaibandha district studying at SUST and creating a platform for them to work together for the welfare of the people of Gaibandha district.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="cosmic-container">
          <CosmicBackground />
        </div>
        <div className="content-wrapper">
          <main className="content-container">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}