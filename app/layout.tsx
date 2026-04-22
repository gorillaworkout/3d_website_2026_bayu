import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bayu Darmawan — Full-Stack Developer & Creative Technologist",
  description:
    "Portfolio of Bayu Darmawan. Building high-performance web apps, immersive 3D interfaces, and AI-powered tools. Full-Stack Developer based in Bandung, Indonesia.",
  keywords: [
    "Bayu Darmawan",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "Three.js",
    "WebGL",
    "Portfolio",
    "Creative Technologist",
  ],
  authors: [{ name: "Bayu Darmawan" }],
  openGraph: {
    title: "Bayu Darmawan — Full-Stack Developer & Creative Technologist",
    description:
      "Building high-performance web apps, immersive 3D interfaces, and AI-powered tools.",
    type: "website",
  },
};

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
