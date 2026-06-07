import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: process.env.DEPLOY_TARGET === 'coolify' ? 'standalone' : 'export',
  images: {
    unoptimized: process.env.DEPLOY_TARGET !== 'coolify',
  },
}

export default nextConfig
