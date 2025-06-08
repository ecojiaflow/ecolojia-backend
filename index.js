const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const { execSync } = require('child_process');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ GET /api/prisma/products → liste les produits
app.get('/api/prisma/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ POST /api/prisma/products → ajoute un produit
app.post('/api/prisma/products', async (req, res) => {
  try {
    const data = req.body;

    const product = await prisma.product.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        slug: data.slug,
        brand: data.brand,
        category: data.category,
        tags: data.tags,
        images: data.images,
        zones_dispo: data.zones_dispo,
        prices: data.prices,
        affiliate_url: data.affiliate_url,
        eco_score: data.eco_score,
        ai_confidence: data.ai_confidence,
        confidence_pct: data.confidence_pct,
        confidence_color: data.confidence_color,
        verified_status: data.verified_status,
        resume_fr: data.resume_fr,
        resume_en: data.resume_en,
        enriched_at: new Date(data.enriched_at),
        created_at: new Date(data.created_at)
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('POST error:', error);
    res.status(400).json({ error: 'Erreur ajout produit' });
  }
});

// ✅ POST /api/suggest → proxy vers n8n
app.post('/api/suggest', async (req, res) => {
  try {
    const { query, zone, lang } = req.body;
    if (!query || !zone || !lang) {
      return res.status(400).json({ error: 'query, zone and lang required' });
    }

    const response = await fetch(process.env.N8N_SUGGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      bo
