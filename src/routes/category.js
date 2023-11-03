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
router.get('/categories/:id', getCategory, async (req, res) => {
  try {
    const category = structuredClone(res.category.toObject());
    const products = await Product.find({ category: req.params.id });
    category.products = products;
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener tres las tres categorías con más productos
router.get('/categories-top', async (req, res) => {
  const categories = await Category.find();
  const topCategories = [];

  for (let i = 0; i < 3; i++) {
    let maxProducts = 0;
    let maxCategory = null;
    let response = null;
    for (let j = 0; j < categories.length; j++) {
      const category = categories[j];
      const products = await Product.find({ category: category._id }).limit(10);
      if (products.length > maxProducts) {
        maxProducts = products.length;
        maxCategory = category;
        response = {
          ...category.toObject(),
          products: products,
        };
      }
    }
    topCategories.push(response);
    categories.splice(categories.indexOf(maxCategory), 1);
  }

  res.json(topCategories);
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
