/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ["www.odonovan.co.uk", "firebasestorage.googleapis.com"],
  },
  experimental: { appDir: true },
};

module.exports = nextConfig;
