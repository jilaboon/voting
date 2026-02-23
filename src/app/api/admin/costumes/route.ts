import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const costumes = await prisma.costume.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(costumes);
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = (body.title ?? '').trim();

    if (!title) {
      return NextResponse.json(
        { error: 'שם התחפושת הוא שדה חובה' },
        { status: 400 },
      );
    }

    const costume = await prisma.costume.create({
      data: {
        title,
        imageUrl: body.imageUrl || null,
      },
    });

    return NextResponse.json(costume, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'שגיאת שרת' },
      { status: 500 },
    );
  }
}
