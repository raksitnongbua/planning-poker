/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
