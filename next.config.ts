import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.autohellas.gr",
      "res.cloudinary.com", //
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bbpcdn.pstatic.gr",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
