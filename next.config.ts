import type { NextConfig } from "next";

const WC26_API_ORIGIN =
  process.env.WC26_API_ORIGIN ?? "https://wc26-api.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/wc26/:path*",
        destination: `${WC26_API_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
