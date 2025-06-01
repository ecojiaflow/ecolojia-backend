import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: any) {
  try {
    const id = params.id;
    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('❌ Erreur PUT /products/[id]', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
