import { NextResponse } from 'next/server';
import { setAdminCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body.password ?? '';

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'סיסמה שגויה' },
        { status: 401 },
      );
    }

    await setAdminCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}
