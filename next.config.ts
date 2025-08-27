import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s3.amazonaws.com" },
      { protocol: "https", hostname: "s3.ap-northeast-2.amazonaws.com" },
      { protocol: "https", hostname: "test-dj-s3-for-imf.s3.ap-northeast-2.amazonaws.com" },
    ],
  },
};

export default nextConfig;
