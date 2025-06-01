import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ContextType = {
  params: {
    id?: string;
    [key: string]: string | undefined;
  };
};

export async function PUT(req: NextRequest, context: ContextType) {
  const id = context.params.id;

  if (!id) {
    return new NextResponse('ID manquant dans l’URL', { status: 400 });
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
