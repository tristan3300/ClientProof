import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
  async rewrites() {
    return [
      {
        source: '/blog/:slug',
        destination: '/blog/:slug.html',
      },
    ];
  },
};

export default nextConfig;
