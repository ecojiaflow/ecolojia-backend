import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialiser Prisma (ou ajustez selon votre configuration)
const prisma = new PrismaClient();

// Définir le type pour les données de mise à jour
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
  context: { params: { id: string } }
) {
  const { id } = context.params;
  
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