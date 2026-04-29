import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  RegisterSW  from "../components/shared/RegisterSW";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A simple habit tracking app built with Next.js and Tailwind CSS.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#422AD5", 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      
      
      <body suppressHydrationWarning className="min-h-full flex flex-col">
      <RegisterSW />
        {children}
      </body>
    </html>
  );
}
