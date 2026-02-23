import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'resetVotes') {
      await prisma.$transaction([
        prisma.vote.deleteMany(),
        prisma.user.updateMany({ data: { hasVoted: false } }),
      ]);

      return NextResponse.json({ success: true });
    }

    if (action === 'resetAll') {
      await prisma.$transaction([
        prisma.vote.deleteMany(),
        prisma.user.deleteMany(),
        prisma.costume.deleteMany(),
        prisma.eventState.upsert({
          where: { id: 1 },
          update: { registrationOpen: true, votingOpen: false },
          create: { id: 1, registrationOpen: true, votingOpen: false },
        }),
      ]);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'פעולה לא מוכרת' },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}
