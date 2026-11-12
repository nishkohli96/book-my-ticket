import { NextResponse, type NextRequest } from 'next/server';
import { apiServicesUrl } from '@/constants/environment';
import { callService } from '@/lib/services';

/**
 * /api/booking/* -> booking-service, same path.
 * Thin authenticated pass-through: the browser never sees the access
 * token, this handler attaches it from the session. booking-service does
 * the validation and returns the messages shown to the user.
 */
async function forward(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api\/booking/, '');
  const hasBody = request.method !== 'GET' && request.method !== 'DELETE';
  const result = await callService(`${apiServicesUrl.booking}${path}`, {
    method: request.method,
    authenticated: true,
    body: hasBody ? await request.json().catch(() => ({})) : undefined,
  });
  return NextResponse.json(result, { status: result.status });
}

export { forward as GET, forward as POST, forward as DELETE };
