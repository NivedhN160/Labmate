import withPWA from "@ducanh2912/next-pwa";

const pwa = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse", "@xenova/transformers", "onnxruntime-node"],
};

export default pwa(nextConfig);
