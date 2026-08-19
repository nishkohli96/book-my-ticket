import path from 'node:path';
import type { NextConfig } from 'next';

const workspaceRoot = path.join(__dirname, '../..');

/* Configure Next.js app */
const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,
  /**
   * :path* = named param path, catches rest of path, zero
   *   or more segments.
   * /api/users/:path* matches:
   * - /api/users → path = undefined
   * - /api/users/123 → path = 123
   * - /api/users/123/orders → path = 123/orders
   * Destination :path* reinserts whole captured tail.
   * Variants: :path+ = one or more (no bare /api/users match), :path (no *\/ +) = exactly one segment.
   */
  async rewrites() {
    return [
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:4001/:path*',
      },
      {
        source: '/api/bookings/:path*',
        destination: 'http://localhost:4002/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com'
      }
    ]
  },
};

export default nextConfig;
