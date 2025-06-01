// Définir le type au début du fichier ou dans un fichier de types séparé
type ProductUpdateData = Partial<{
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  // Ajoutez ici les autres champs de votre modèle Product selon votre schéma Prisma
}>;

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