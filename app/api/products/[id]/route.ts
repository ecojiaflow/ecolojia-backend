import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajustez le chemin selon votre structure

// Définir le type au début du fichier
type ProductUpdateData = Partial<{
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  // Ajoutez ici les autres champs de votre modèle Product selon votre schéma Prisma
}>;

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const body = await req.json() as ProductUpdateData;

    console.log('🔧 ID reçu :', id);
    console.log('🔧 Body reçu :', JSON.stringify(body, null, 2));

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ Erreur PUT /api/products/[id]', message);
    return new NextResponse(`Erreur serveur: ${message}`, { status: 500 });
  }
}