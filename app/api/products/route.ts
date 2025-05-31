// app/api/products/route.ts

import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()

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
  })

  await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  })

  return new Response(JSON.stringify(newProduct), { status: 201 })
}
