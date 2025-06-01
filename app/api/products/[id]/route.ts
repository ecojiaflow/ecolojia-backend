import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Context {
  params: {
    id: string;
  };
}

export async function PUT(req: NextRequest, context: Context) {
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
  } catch (error: any) {
    console.error('❌ Erreur PUT /api/products/[id]', error.message || error);
    return new NextResponse(`Erreur serveur: ${error.message || 'inconnue'}`, {
      status: 500,
    });
  }
}
