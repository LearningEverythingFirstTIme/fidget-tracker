import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      collections: {
        include: {
          items: {
            include: { category: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  });

  return NextResponse.json(user?.collections[0]?.items || []);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId, email: data.email || '' },
    });
  }

  let collection = await prisma.collection.findFirst({ where: { userId: user.id } });
  if (!collection) {
    collection = await prisma.collection.create({
      data: { userId: user.id, name: 'My Collection' },
    });
  }

  const item = await prisma.item.create({
    data: {
      collectionId: collection.id,
      categoryId: data.categoryId,
      name: data.name,
      brand: data.brand || null,
      description: data.description || null,
      pricePaid: data.pricePaid ? parseFloat(data.pricePaid) : null,
      currentValue: data.currentValue ? parseFloat(data.currentValue) : null,
      imageUrl: data.imageUrl || null,
      status: data.status || 'OWNED',
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
