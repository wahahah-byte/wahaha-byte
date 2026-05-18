import type { NextConfig } from "next";

// GitHub Actions sets NEXT_PUBLIC_BASE_PATH via actions/configure-pages with
// static_site_generator: next, so CI builds get the right prefix automatically.
// Dev runs and local prod builds fall back to empty (root-relative).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
  // rewrites are ignored during static export build but still work in `next dev`.
  // Skip entirely when NEXT_PUBLIC_API_URL is unset (e.g. the Pages CI build) —
  // otherwise the destination becomes "undefined/:path*" and Next fails validation.
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return [];
    return [
      {
        source: "/backend/:path*",
        destination: `${api}/:path*`,
      },
    ];
  },
};

export default nextConfig;
