import NavBar from "@/components/NavBar";
import { ThreeScene } from '../components/ThreeScene';
import "./globals.css";
import type { Metadata } from "next";

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
        <ThreeScene/>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
