import path from 'node:path';
import type { NextConfig } from 'next';

const workspaceRoot = path.join(__dirname, '../..');

/* Configure Next.js app */
const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com'
      },
      {
        /* Event artwork comes straight from Ticketmaster's CDN. */
        protocol: 'https',
        hostname: '*.ticketm.net'
      }
    ]
  },
};

export default nextConfig;
