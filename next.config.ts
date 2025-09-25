import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all https domains
      },
      {
        protocol: "http",
        hostname: "**", // allow all http domains
      },
    ],
  },
};

export default nextConfig;
