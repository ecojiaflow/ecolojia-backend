import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// @ts-expect-error Next.js App Router doesn't export valid types for context
export async function PUT(req: NextRequest, context) {
  try {
    const id = context.params.id;
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
