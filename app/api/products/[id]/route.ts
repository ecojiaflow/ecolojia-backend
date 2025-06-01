import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, context) {
  const id = context?.params?.id;

  if (!id || typeof id !== 'string') {
    return new NextResponse('ID manquant ou invalide', { status: 400 });
  }

  try {
    const body = await req.json();

    console.log('🔧 ID reçu :', id);
    console.log('🔧 Body reçu :', JSON.stringify(body, null, 2));

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ Erreur PUT /api/products/[id]', message);
    return new NextResponse(`Erreur serveur: ${message}`, { status: 500 });
  }
}
