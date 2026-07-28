import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "pg-pool"],
  // Disable Next.js image optimizer for static assets – it adds overhead and
  // prevents browser caching. By serving images directly we get faster loads and
  // can control caching via headers.
  images: {
    unoptimized: true,
  },
  // Add long‑term caching for road‑sign assets under public/uploads/road-signs.
  // Browsers will keep the PNGs for a day, reducing repeated fetches.
  async headers() {
    return [
      {
        source: '/uploads/road-signs/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, immutable' }],
      },
    ];
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "@prisma/client": "commonjs @prisma/client",
        "pg-native": "commonjs pg-native",
      });
    }
    return config;
  },
};

export default nextConfig;
