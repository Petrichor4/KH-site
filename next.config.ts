import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // webpack: (config) => {
  //   config.cache = {
  //     type: "filesystem",
  //     compression: "gzip", // Compress cache files to reduce size
  //     maxAge: 24 * 60 * 60 * 1000, // Cache for 1 day
  //     buildDependencies: {
  //       config: [__filename], // Ensure changes in config files are considered
  //     },
  //   };
  //   return config;
  // },
};

export default nextConfig;
