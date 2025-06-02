import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

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

// Lancement du serveur
app.listen(process.env.PORT || 3000, () =>
  console.log('✅ API running on port 3000')
);
