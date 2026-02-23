import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let state = await prisma.eventState.findFirst({ where: { id: 1 } });

    if (!state) {
      state = await prisma.eventState.create({ data: { id: 1 } });
    }

    const [userCount, voteCount] = await Promise.all([
      prisma.user.count(),
      prisma.vote.count(),
    ]);

    return NextResponse.json({
      registrationOpen: state.registrationOpen,
      votingOpen: state.votingOpen,
      userCount,
      voteCount,
    });
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const data: { registrationOpen?: boolean; votingOpen?: boolean } = {};

    if (typeof body.registrationOpen === 'boolean') {
      data.registrationOpen = body.registrationOpen;
    }
    if (typeof body.votingOpen === 'boolean') {
      data.votingOpen = body.votingOpen;
    }

    const state = await prisma.eventState.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    return NextResponse.json({
      registrationOpen: state.registrationOpen,
      votingOpen: state.votingOpen,
    });
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}
