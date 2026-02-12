import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standalone output works well on Vercel and other Node environments.
  output: "standalone",
};

export default nextConfig;
