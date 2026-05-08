import type { NextConfig } from "next";

// In production we deploy to GitHub Pages at /wahaha-byte/. Dev runs at root.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/wahaha-byte" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  env: {
    // Surface the prefix at runtime so plain <img src> tags can prepend it.
    // Next.js doesn't auto-rewrite arbitrary string paths — only managed assets.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // rewrites are ignored during static export build but still work in `next dev`
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
