import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  typedRoutes: true,
};

export default nextConfig;
