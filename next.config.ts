import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion', 'framer-motion', 'clsx', 'tailwind-merge'],
  },
};

export default nextConfig;
