const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch'); // requis pour n8n
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
      orderBy: { createdAt: 'desc' },
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
    const {
      name, slug, resume_fr, resume_en, tags,
      zones_dispo, criteria_score, eco_score,
      ai_confidence, confidence_pct, confidence_color,
      affiliate_url, suggested_by_ai, lang,
      verified_status, expiry_date
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        resume_fr,
        resume_en,
        tags,
        zones_dispo,
        criteria_score,
        eco_score,
        ai_confidence,
        confidence_pct,
        confidence_color,
        affiliate_url,
        suggested_by_ai,
        lang,
        verified_status,
        expiry_date: expiry_date ? new Date(expiry_date) : null
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('POST error:', error);
    res.status(400).json({ error: 'Erreur ajout produit' });
  }
});

// ✅ POST /api/suggest → passe la requête à n8n
app.post('/api/suggest', async (req, res) => {
  try {
    const { query, zone, lang } = req.body;
    if (!query || !zone || !lang) {
      return res.status(400).json({ error: 'query, zone and lang required' });
    }

    const response = await fetch(process.env.N8N_SUGGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, zone, lang })
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error('Erreur IA suggest:', err);
    res.status(500).json({ error: 'Erreur lors de la suggestion IA' });
  }
});

// ✅ Route test GET /
app.get('/', (req, res) => {
  res.send('Hello from Ecolojia backend!');
});

// ✅ Route santé GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'up' });
});

// 🛠️ Route temporaire pour initialiser la BDD à distance
app.get('/init-db', async (req, res) => {
  try {
    execSync('npx prisma db push');
    res.send('✅ Base de données synchronisée avec Prisma.');
  } catch (error) {
    console.error('❌ Erreur db push:', error);
    res.status(500).send('Erreur lors du db push');
  }
});

// ✅ Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API running on port ${PORT}`);
});
