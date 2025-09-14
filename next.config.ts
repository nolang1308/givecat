import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'resource.logitech.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // 모든 외부 도메인 허용 (보안상 필요시 특정 도메인만 허용)
        port: '',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
