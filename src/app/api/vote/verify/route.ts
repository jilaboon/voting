import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = (body.phone ?? '').trim();

    if (!phone) {
      return NextResponse.json(
        { status: 'NOT_FOUND' },
        { status: 404 },
      );
    }

    const state = await prisma.eventState.findFirst({ where: { id: 1 } });
    if (!state?.votingOpen) {
      return NextResponse.json({ status: 'VOTING_CLOSED' });
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json(
        { status: 'NOT_FOUND' },
        { status: 404 },
      );
    }

    if (user.hasVoted) {
      return NextResponse.json(
        { status: 'ALREADY_VOTED' },
        { status: 409 },
      );
    }

    return NextResponse.json({ status: 'OK', userId: user.id });
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}
