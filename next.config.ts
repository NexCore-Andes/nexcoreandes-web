import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Genera un servidor mínimo en .next/standalone para la imagen Docker
  output: 'standalone',
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
