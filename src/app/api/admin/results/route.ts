import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const costumes = await prisma.costume.findMany({
      include: { _count: { select: { votes: true } } },
      orderBy: { votes: { _count: 'desc' } },
    });

    return NextResponse.json(costumes);
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}
