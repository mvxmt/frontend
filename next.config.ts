import type { NextConfig } from "next";
import {env} from "node:process"

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${env.API_URL}/:path*`!
      }
    ]
  },
};

export default nextConfig;
