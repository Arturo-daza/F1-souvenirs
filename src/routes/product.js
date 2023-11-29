const express = require('express');
const router = express.Router(); //manejador de rutas de express
const userSchema = require('../models/user');
const productSchema = require('../models/product.js');
const categorySchema = require('../models/category');
const auth = require('./auth-validation');

//Nuevo product


router.post('/products', auth, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const user = await userSchema.findById(req.userData.user._id);
    const seller = user.id;

    const categoryObj = await categorySchema.findOne({ _id: category });

    const nuevoProducto = new productSchema({
      name,
      description,
      price,
      image,
      seller,
      category: categoryObj.id,
    });

    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Obtener todos los products
router.get('/products', (req, res) => {
  productSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// consult by id
router.get('/products/:id', (req, res) => {
  const { id } = req.params;
  productSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Ruta para actualizar una product por su ID
router.put('/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, category } = req.body;
  const user = await userSchema.findById(req.userData.user._id);
  const seller = user._id;

  const product = await productSchema.findById(id);
  if (!product.seller.equals(seller)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const categoryObj = await categorySchema.findOne({ _id: category });
    if (!categoryObj) {
      throw new Error('Categoria no encontrada');
    }
    productSchema
      .updateOne(
        { _id: id },
        {
          $set: {
            name,
            description,
            price,
            image,
            seller,
            category: categoryObj.id,
          },
        }
      )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Eliminar un product por su id
router.delete('/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  productSchema
    .findByIdAndDelete(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// endpoint get for seller id
router.get('/products-by-seller', auth, (req, res) => {
  productSchema
    .find({ seller: req.userData.user._id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
/**
 * @swagger
 * paths:
 *   /api/products:
 *     post:
 *       tags: [Product]
 *       summary: Create a new product
 *       parameters:
 *         - in: header
 *           name: authorization
 *           description: The token for authentication
 *           required: true
 *           type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               name: "Laptop"
 *               description: "A portable computer"
 *               price: 1000
 *               image: "https://example.com/laptop.jpg"
 *               seller: "5f9a1c3b8a1e2c0017f6a8b2"
 *               category: "Electronics"
 *       responses:
 *         '201':
 *           description: Product created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *               example:
 *                 _id: "5f9a1c3b8a1e2c0017f6a8b3"
 *                 name: "Laptop"
 *                 description: "A portable computer"
 *                 price: 1000
 *                 image: "https://example.com/laptop.jpg"
 *                 seller: "5f9a1c3b8a1e2c0017f6a8b2"
 *                 category: "Electronics"
 *                 __v: 0
 *         '400':
 *           description: Invalid request parameters
 *         '500':
 *           description: Internal server error
 */
// Obtener todos los productos
/**
 * @swagger
 * paths:
 *   /api/products:
 *     get:
 *       tags: [Product]
 *       summary: Get all products
 *       responses:
 *         '200':
 *           description: Successfully retrieved products
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Product'
 *         '500':
 *           description: Internal server error
 */
// Consultar por ID
/**
 * @swagger
 * paths:
 *   /products/{id}:
 *     get:
 *       tags: [Product]
 *       summary: Get a product by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the product to retrieve
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved the product
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *         '404':
 *           description: Product not found
 *         '500':
 *           description: Internal server error
 */
// Actualizar un producto por ID
/**
 * @swagger
 * paths:
 *   /products/{id}:
 *     put:
 *       tags: [Product]
 *       summary: Update a product by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the product to update
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
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               name: "Updated Laptop"
 *               description: "An updated portable computer"
 *               price: 1200
 *               image: "https://example.com/updated-laptop.jpg"
 *               category: "Updated Electronics"
 *       responses:
 *         '200':
 *           description: Product updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *         '400':
 *           description: Invalid request parameters or category not found
 *         '401':
 *           description: Unauthorized - The provided JWT token is invalid or expired
 *         '404':
 *           description: Product not found
 *         '500':
 *           description: Internal server error
 */
// Eliminar un producto por ID
/**
 * @swagger
 * paths:
 *   /products/{id}:
 *     delete:
 *       tags: [Product]
 *       summary: Delete a product by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the product to delete
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
 *           description: Product deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *         '401':
 *           description: Unauthorized - The provided JWT token is invalid or expired
 *         '404':
 *           description: Product not found
 *         '500':
 *           description: Internal server error
 */