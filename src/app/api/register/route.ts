import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body.name ?? '').trim();
    const phone = (body.phone ?? '').trim().replace(/[\s\-]/g, '');

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'שם וטלפון הם שדות חובה' },
        { status: 400 },
      );
    }

    const state = await prisma.eventState.findFirst({ where: { id: 1 } });
    if (!state?.registrationOpen) {
      return NextResponse.json(
        { error: 'ההרשמה סגורה' },
        { status: 403 },
      );
    }

    try {
      await prisma.user.create({ data: { name, phone } });
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        return NextResponse.json(
          { error: 'מספר הטלפון הזה כבר רשום' },
          { status: 409 },
        );
      }
      throw err;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}
