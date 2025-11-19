import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile images
      "localhost", // Local development
      "svifqydoijnmlahxdwpn.supabase.co", // Supabase storage
    ],
  },
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
};

export default nextConfig;
