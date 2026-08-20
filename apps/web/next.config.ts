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
    /**
     * Destination host comes from an env var so the same config works
     * unchanged in every environment:
     * - bare local dev: http://localhost:8001
     * - docker compose (this app also containerized): http://user-service:8001
     * - production: wherever that service is actually deployed
     *
     * Destination also re-adds the "/api" prefix each backend service
     * mounts its routes under (e.g. POST /api/auth/signup) - the :path*
     * capture only contains what comes after /api/users, so it must be
     * added back here or every proxied request 404s on the backend.
     */
    const userServiceUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:8001';
    const bookingServiceUrl = process.env.BOOKING_SERVICE_URL ?? 'http://localhost:8001';

    return [
      {
        source: '/api/users/:path*',
        destination: `${userServiceUrl}/api/:path*`,
      },
      {
        source: '/api/bookings/:path*',
        destination: `${bookingServiceUrl}/api/:path*`,
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
