import type { NextConfig } from "next";

const API_TARGET_URL =
  process.env.NEXT_PUBLIC_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    inlineCss: true,
  },
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./src/lib/noop.js",
    },
  },
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${API_TARGET_URL}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/((?!api-proxy).*)",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
    ];
  },
};

export default nextConfig;