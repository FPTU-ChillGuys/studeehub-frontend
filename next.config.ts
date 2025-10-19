import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile images
      "localhost", // Local development
    ],
  },
};

export default nextConfig;
