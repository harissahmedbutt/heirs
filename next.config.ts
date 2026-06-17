import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so a stray lockfile in a parent
  // directory can't be picked up as the root or cause duplicate module resolution.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'blanket.ae' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
}

export default nextConfig
