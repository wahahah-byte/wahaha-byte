import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // rewrites are not supported with static export — re-enable when deploying to the live server
  // async rewrites() {
  //   return [{ source: "/backend/:path*", destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*` }];
  // },
};

export default nextConfig;
