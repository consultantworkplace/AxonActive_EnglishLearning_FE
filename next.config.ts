import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";
    console.log(">>> BACKEND_URL at build time:", backendUrl);
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
