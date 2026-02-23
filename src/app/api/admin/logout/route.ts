import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return NextResponse.redirect(new URL('/', request.url));
}
