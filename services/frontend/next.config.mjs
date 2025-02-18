/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_REDUX_PERSIST_SSR_DISABLE: 'true',
  },
  // Cấu hình cho @react-pdf/renderer
  transpilePackages: ['@react-pdf/renderer'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  images: {
    domains: ['imagetravel.vn', 'aucoeurvietnam.com', 'mekongvillages.com', 'cdnjs.cloudflare.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagetravel.vn',
      },
      {
        protocol: 'https',
        hostname: 'aucoeurvietnam.com',
      },
      {
        protocol: 'https',
        hostname: 'mekongvillages.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    unoptimized: true,
  },
  // Cho phép đọc file từ public folder
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
};

export default nextConfig;
