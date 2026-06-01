import type { NextConfig } from "next";

// Deploy servidor poli: NEXT_PUBLIC_BASE_PATH=/~uno
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  //assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
