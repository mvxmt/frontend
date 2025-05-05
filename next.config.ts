import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    proxyTimeout: 0
  }
};

export default nextConfig;
