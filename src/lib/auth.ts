import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_token';

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET env var is required');
  return secret;
}

export function signToken(payload: string): string {
  const secret = getSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.substring(0, lastDot);
  const expected = signToken(payload);
  return token === expected;
}

export async function setAdminCookie(): Promise<void> {
  const token = signToken('admin=1');
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}
