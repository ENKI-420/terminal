/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'il21sa1fvludefejl.lite.vusercontent.net',
      'lite.vusercontent.net',
      'vusercontent.net',
      'vercel.app'
    ],
    // Increase buffer size for large images if needed
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Set reasonable limits
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    unoptimized: true,
  },
  // Increase memory limit for image optimization
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB
  },
  // Add proper content security policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              img-src 'self' data: blob: https://*.vusercontent.net https://*.vercel.app;
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              font-src 'self' data:;
              connect-src 'self' https://*.vercel.app https://*.vusercontent.net;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  },
  // Increase timeout for static generation
  staticPageGenerationTimeout: 120,
}

export default nextConfig
