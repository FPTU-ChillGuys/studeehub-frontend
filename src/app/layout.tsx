import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import NextTopLoader from "nextjs-toploader";
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
  title: "StudeeHub",
  description: "Nền tảng học tập trực tuyến",
  icons: {
    icon: [
      { url: "/logo.PNG", sizes: "32x32", type: "image/png" },
      { url: "/logo.PNG", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.PNG",
    apple: "/logo.PNG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.PNG" type="image/png" />
        <link rel="shortcut icon" href="/logo.PNG" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.PNG" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader color="#FF0000" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
