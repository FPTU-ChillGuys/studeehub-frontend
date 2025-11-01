import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Metadata } from "next";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.PNG" type="image/png" />
        <link rel="shortcut icon" href="/logo.PNG" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.PNG" />
      </head>
      <body>
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ display: "contents" }}>
          <NextTopLoader color="#FF0000" />
          <Providers session={session}>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
