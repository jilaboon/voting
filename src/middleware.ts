import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_token';

async function verifyTokenEdge(token: string, secret: string): Promise<boolean> {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;

  const payload = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const expectedHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return signature === expectedHex;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for login page and API login route
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const valid = await verifyTokenEdge(token, secret);
  if (!valid) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
