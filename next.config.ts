import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@imgly/background-removal"],
  images: {
    unoptimized: true, // Try to disable optimization to save resources during build
  },
  turbopack: {
    rules: {
      "*.wasm": {
        loaders: ["file-loader"],
        as: "*.wasm",
      },
    }
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
};

// export default withPWA({
//   dest: "public",
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   disable: process.env.NODE_ENV === "development",
//   workboxOptions: {
//     disableDevLogs: true,
//   },
// })(nextConfig);

export default nextConfig;
