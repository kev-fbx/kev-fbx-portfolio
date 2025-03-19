import NavBar from "@/components/NavBar";
import { ThreeScene } from '../components/ThreeScene';
import "./globals.css";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
    title: "Kevin | Portfolio",
    description: "./kev.fbx",
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SpeedInsights/>
        <ThreeScene/>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
