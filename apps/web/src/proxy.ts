import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { queryParamNames } from '@/constants';

const protectedRoutes = ['/my-account'];

export default auth(request => {
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  if (isProtectedRoute && !request.auth) {
    const loginUrl = new URL('/login', request.nextUrl.origin);
    loginUrl.searchParams.set(queryParamNames.callbackUrl, request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/my-account/:path*'],
};
