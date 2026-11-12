/**
 * Server-only helpers for calling the backend services through the
 * gateway. Used by Server Components and Route Handlers - never import
 * from a client component (it pulls in the server-only env config).
 */
import { auth } from '@/app/api/auth/[...nextauth]/route';

export type ServiceResult<T> = {
  ok: boolean;
  status: number;
  message: string;
  data: T | null;
};

type ServiceRequest = Omit<RequestInit, 'body'> & {
  /** Sent as JSON. */
  body?: unknown;
  /** Attach the signed-in user's access token. Resolves to a 401 result if there is no session. */
  authenticated?: boolean;
};

export async function callService<T>(
  url: string,
  { body, authenticated = false, headers, ...init }: ServiceRequest = {}
): Promise<ServiceResult<T>> {
  const session = authenticated ? await auth() : null;
  if (authenticated && !session?.accessToken) {
    return {
      ok: false,
      status: 401,
      message: 'Not authenticated',
      data: null
    };
  }

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      ...init,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const result = await response.json() as { message?: string; data?: T };
    return {
      ok: response.ok,
      status: response.status,
      message: result.message ?? (response.ok ? 'Success' : 'Request failed'),
      data: response.ok ? result.data ?? null : null,
    };
  } catch {
    /* Service down or unreachable - callers render an error state instead of crashing the page. */
    return {
      ok: false,
      status: 503,
      message: 'Service unavailable. Please try again.',
      data: null
    };
  }
}
