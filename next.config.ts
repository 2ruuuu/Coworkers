import type { NextConfig } from 'next';

import { ALLOWED_IMAGE_HOSTS, MAX_IMAGE_UPLOAD_MB } from './src/constants/image';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  experimental: {
    serverActions: {
      // 이미지 파일을 Server Action으로 업로드하므로 기본값(1MB)보다 늘린다. (여유분 1MB 포함)
      bodySizeLimit: `${MAX_IMAGE_UPLOAD_MB + 1}mb`,
    },
  },
  images: {
    // default: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    qualities: [75, 85, 90],
    remotePatterns: ALLOWED_IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
      pathname: '/**',
    })),
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
