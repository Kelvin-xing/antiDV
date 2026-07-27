/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendOrigin = process.env.XIAOAN_API_ORIGIN || 'http://127.0.0.1:8000'
    return [
      {
        source: '/v1/:path*',
        destination: `${backendOrigin}/v1/:path*`,
      },
    ]
  },
  productionBrowserSourceMaps: false, // enable browser source map generation during the production build
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    // appDir: true,
  },
  output: 'standalone',

  async headers() {
    return [
      // Global security headers applied to every response
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Block framing — important for a DV support site (prevents clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Limit referrer information sent to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict access to sensitive browser APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
      // Tell crawlers not to index ephemeral chat sessions
      {
        source: '/chat(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
