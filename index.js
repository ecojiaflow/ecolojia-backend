const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch'); // ← nécessaire si pas natif dans ton Node env

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /api/products → liste les produits
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(products);
});

// POST /api/products → ajoute un produit
app.post('/api/products', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'title and description required' });
  }

  const product = await prisma.product.create({
    data: { title, description },
  });

  res.status(201).json(product);
});

// POST /api/suggest → passe la requête à n8n webhook
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

// Lancement du serveur
app.listen(process.env.PORT || 3000, () =>
  console.log('✅ API running on port 3000')
);
