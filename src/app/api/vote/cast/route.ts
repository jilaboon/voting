import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = (body.phone ?? '').trim();
    const costumeId = (body.costumeId ?? '').trim();

    if (!phone || !costumeId) {
      return NextResponse.json(
        { error: 'חסרים פרטים' },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { phone } });
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }
      if (user.hasVoted) {
        throw new Error('ALREADY_VOTED');
      }

      const costume = await tx.costume.findUnique({ where: { id: costumeId } });
      if (!costume) {
        throw new Error('COSTUME_NOT_FOUND');
      }

      await tx.vote.create({
        data: { userId: user.id, costumeId },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { hasVoted: true },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : '';

    if (message === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 },
      );
    }
    if (message === 'ALREADY_VOTED') {
      return NextResponse.json(
        { error: 'כבר הצבעת' },
        { status: 409 },
      );
    }
    if (message === 'COSTUME_NOT_FOUND') {
      return NextResponse.json(
        { error: 'תחפושת לא נמצאה' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}
