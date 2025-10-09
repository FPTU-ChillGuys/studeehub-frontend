import type { Metadata } from "next"

// Static metadata for better SEO and pre-rendering
export const metadata: Metadata = {
  title: "Gói Đăng Ký StudeeHub | Chọn Gói Phù Hợp",
  description: "Chọn gói phù hợp với nhu cầu học tập của bạn. Freemium miễn phí, Student Pro 49.000 VND/tháng, Premium Plus 79.000 VND/tháng.",
  keywords: ["StudeeHub", "subscription", "pricing", "education", "AI learning", "student discount", "Vietnam"],
  openGraph: {
    title: "Gói Đăng Ký StudeeHub",
    description: "Trải nghiệm học tập cao cấp với AI tiên tiến. Ưu đãi đặc biệt cho sinh viên Việt Nam.",
    type: "website",
    images: [
      {
        url: "/logo.PNG",
        width: 1200,
        height: 630,
        alt: "StudeeHub Subscription Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gói Đăng Ký StudeeHub",
    description: "Trải nghiệm học tập cao cấp với AI tiên tiến. Ưu đãi đặc biệt cho sinh viên Việt Nam.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Enable static generation for better performance
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
