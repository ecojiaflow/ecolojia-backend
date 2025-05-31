import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description ?? '',
        lang: body.lang ?? 'fr',
        zones_dispo: body.zones_dispo ?? ['FR'],
        affiliate_url: body.affiliate_url ?? '',
        criteria_score: body.criteria_score ?? {
          composition: 0,
          emballage: 0,
          provenance: 0,
          certifications: 0,
          durabilite: 0
        },
        verified_status: 'manual_review',
        suggested_by_ai: false
      }
    });

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
    } else {
      console.warn("⚠️ N8N_WEBHOOK_URL non défini");
    }

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error('❌ Erreur API /api/products:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
