import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: { title?: string; imageUrl?: string | null } = {};

    if (typeof body.title === 'string' && body.title.trim()) {
      data.title = body.title.trim();
    }
    if (body.imageUrl !== undefined) {
      data.imageUrl = body.imageUrl || null;
    }

    const costume = await prisma.costume.update({
      where: { id },
      data,
    });

    return NextResponse.json(costume);
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2025'
    ) {
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.costume.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2025'
    ) {
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
