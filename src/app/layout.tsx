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
  title: "b3k1c.exe // Portfolio",
  description: "Digital portfolio — Designs, Web Sites, Foto/Video, Game Developing",
  keywords: ["b3k1c", "portfolio", "design", "web", "video", "game development"],
  icons: {
    icon: "/b3k1c-logo.png",
  },
  openGraph: {
    title: "b3k1c.exe // Portfolio",
    description: "Digital portfolio — Designs, Web Sites, Foto/Video, Game Developing",
    images: [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
