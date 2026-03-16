import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const item = await prisma.item.update({
    where: { id },
    data: {
      name: data.name,
      brand: data.brand || null,
      description: data.description || null,
      categoryId: data.categoryId,
      pricePaid: data.pricePaid ? parseFloat(data.pricePaid) : null,
      currentValue: data.currentValue ? parseFloat(data.currentValue) : null,
      imageUrl: data.imageUrl || null,
      status: data.status,
      condition: data.condition || null,
      material: data.material || null,
      weightGrams: data.weightGrams ? parseFloat(data.weightGrams) : null,
      dimensions: data.dimensions || null,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
      purchaseSource: data.purchaseSource || null,
      notes: data.notes || null,
      quantity: parseInt(data.quantity) || 1,
      isCustom: data.isCustom || false,
      customMods: data.customMods || null,
    },
    include: { category: true },
  });

  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.item.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
