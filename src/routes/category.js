const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');
const auth = require('./auth-validation');

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
    res.status(201).json(category);
  } catch (error) {
    return res.status(404).json({ message: 'Categoria no encontrada' });
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

  res.status(201).json(topCategories);
});

// Crear una categoría
router.post('/categories', auth, async (req, res) => {
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

router.patch('/categories/:id', getCategory, auth, async (req, res) => {
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
router.delete('/categories/:id', getCategory, auth, async (req, res) => {
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
      return res.status(404).json({ message: 'Categoria no encontrada' });
    }
  } catch (error) {
    return res.status(404).json({ message: 'Categoria no encontrada' });
  }

  res.category = category;
  next();
}

module.exports = router;
/**
 * @swagger
 * paths:
 *   /api/categories:
 *     get:
 *       tags: [Category]
 *       summary: Get all categories
 *       responses:
 *         '200':
 *           description: Successfully retrieved all categories
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Category'
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/categories/{id}:
 *     get:
 *       tags: [Category]
 *       summary: Get a specific category with its associated products
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the category to retrieve
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved the category with associated products
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the category
 *                   products:
 *                     type: array
 *                     description: An array of products associated with the category
 *                     items:
 *                       $ref: '#/components/schemas/Product'
 *         '500':
 *           description: Internal server error
 */


/**
 * @swagger
 * paths:
 *   /api/categories-top:
 *     get:
 *       tags: [Category]
 *       summary: Get the top three categories with the most products
 *       responses:
 *         '200':
 *           description: Successfully retrieved the top three categories with the most products
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the category
 *                     products:
 *                       type: array
 *                       description: An array of products associated with the category
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *         '500':
 *           description: Internal server error
 */


/**
 * @swagger
 * paths:
 *   /api/categories:
 *     post:
 *       tags: [Category]
 *       summary: Create a new category
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: The JWT token for authentication
 *           required: true
 *           type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the category
 *               required:
 *                 - name
 *       responses:
 *         '201':
 *           description: Category created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Category'
 *         '400':
 *           description: Invalid request parameters
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/categories/{id}:
 *     put:
 *       tags: [Category]
 *       summary: Update a category
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the category to update
 *           required: true
 *           schema:
 *             type: string
 *         - in: header
 *           name: Authorization
 *           description: The JWT token for authentication
 *           required: true
 *           type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The updated name of the category
 *               required:
 *                 - name
 *       responses:
 *         '200':
 *           description: Category updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Category'
 *         '400':
 *           description: Invalid request parameters
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/categories/{id}:
 *     delete:
 *       tags: [Category]
 *       summary: Delete a category
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the category to delete
 *           required: true
 *           schema:
 *             type: string
 *         - in: header
 *           name: Authorization
 *           description: The JWT token for authentication
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: Category deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '500':
 *           description: Internal server error
 */