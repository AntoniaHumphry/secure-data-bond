import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Required by FHEVM and Base Account SDK
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          // CSP is handled by vercel.json for production deployment
        ],
      },
    ];
  },
  // Suppress some warnings in development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Force webpack instead of Turbopack to avoid runtime errors
  webpack: (config, { dev }) => {
    // Ensure we're using webpack for stability

    // Fix for MetaMask SDK trying to import React Native modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
  // Environment variables are now read from .env.local file
};

export default nextConfig;
