import { NextResponse, type NextRequest } from 'next/server';
import { apiServicesUrl } from '@/constants/environment';
import { callService } from '@/lib/services';

/**
 * GET /api/event/* -> event-service, same path.
 * Public, read-only pass-through (the seat map polls this).
 */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api\/event/, '');
  const result = await callService(`${apiServicesUrl.event}${path}${request.nextUrl.search}`);
  return NextResponse.json(result, { status: result.status });
}
