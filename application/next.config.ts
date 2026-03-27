/** @type {import('next').NextConfig} */
// Deployment trigger: Project rename to macnasmanager
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fsbpxifvpjtkrltfizmv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

// Final sync trigger
