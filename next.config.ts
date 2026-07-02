import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/privacy-policy/fridge-manager',
        destination: '/privacy-policy/fridge-manager.html',
      },
    ];
  },
};

export default nextConfig;