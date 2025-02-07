/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_REDUX_PERSIST_SSR_DISABLE: 'true',
  },
  images: {
    // Định nghĩa các domain cho phép load ảnh
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Nên giới hạn cụ thể các domain được phép
      },
    ],
    // Cấu hình device sizes để tối ưu responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Cấu hình image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Định dạng ảnh được hỗ trợ
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
