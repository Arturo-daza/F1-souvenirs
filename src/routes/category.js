const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');

// Obtener todas las categorías
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una categoría
router.get('/categories/:id', getCategory, (req, res) => {
  res.json(res.category);
});

// Crear una categoría
router.post('/categories', async (req, res) => {
  const category = new Category({
    name: req.body.name,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar una categoría

router.patch('/categories/:id', getCategory, async (req, res) => {
  if (req.body.name != null) {
    res.category.name = req.body.name;
  }

  try {
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar una categoría
router.delete('/categories/:id', getCategory, async (req, res) => {
  try {
    await res.category.remove();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los productos de una categoría
router.get('/categories/:id/products', getCategory, async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware para obtener una categoría por ID

async function getCategory(req, res, next) {
  let category;
  try {
    category = await Category.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.category = category;
  next();
}

module.exports = router;