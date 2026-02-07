import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:workId",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
