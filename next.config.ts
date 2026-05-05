import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MDX is handled by next-mdx-remote at runtime — no compiler plugin needed
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;
