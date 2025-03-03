import type { NextConfig } from "next";
import nextPwa from "next-pwa";

const withPWA = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
}) as (config: NextConfig) => NextConfig;

const nextConfig: NextConfig = withPWA({
  reactStrictMode: true,
});

export default nextConfig;
