import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
    });

    return new NextResponse(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error('❌ Erreur PUT /api/products/[id]:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}

