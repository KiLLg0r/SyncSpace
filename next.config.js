/** @type {import('next').NextConfig} */
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new MonacoWebpackPlugin({ filename: "static/[name].worker.js" }));
    return config;
  },
  reactStrictMode: true,
  transpilePackages: ["monaco-editor"],
};

module.exports = nextConfig;
