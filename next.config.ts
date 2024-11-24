import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
