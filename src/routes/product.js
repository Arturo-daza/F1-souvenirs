const express = require('express');
const router = express.Router(); //manejador de rutas de express
const userSchema = require('../models/user');
const productSchema = require('../models/product.js');
const categorySchema = require('../models/category');
const auth = require('./auth-validation');

//Nuevo product
/**
 * @swagger
 * paths:
 *   /product:
 *     post:
 *       tags: [Product]
 *       summary: Create a new product
 *       parameters:
 *         - in: header
 *           name: access-token
 *           description: The token for authentication
 *           required: true
 *           type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Product'
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
 *                 $ref: '#/definitions/Product'
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

router.post('/products', auth, async (req, res) => {
  try {
    const { name, description, price, image, categoryName } = req.body;
    const user = await userSchema.findById(req.userData.id);
    const seller = user.id;

    const categoryObj = await categorySchema.findOne({ name: categoryName });
    const category = categoryObj.id;

    const nuevoProducto = new productSchema({
      name,
      description,
      price,
      image,
      seller,
      category,
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
  const { name, description, price, image, categoryName } = req.body;
  const user = await userSchema.findById(req.userData.user._id);
  const seller = user._id;

  try {
    const categoryObj = await categorySchema.findOne({ name: categoryName });
    if (!categoryObj) {
      throw new Error('Category not found');
    }
    const category = categoryObj.id;
    productSchema
      .updateOne(
        { _id: id },
        {
          $set: { name, description, price, image, seller, category },
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
router.get('/products/seller/:id', (req, res) => {
  const { id } = req.params;
  productSchema
    .find({ seller: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
