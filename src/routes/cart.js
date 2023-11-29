const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const auth = require('./auth-validation');
const userSchema = require('../models/user');

// Agregar un producto al carrito
router.post('/cart/add', auth, async (req, res) => {
  const userData = await userSchema.findById(req.userData.user._id);
  user = req.userData.id;
  try {
    const { product, quantity } = req.body;

    // Verificar si el usuario ya tiene un carrito
    let cart = await Cart.findOne({ user });

    if (!cart) {
      // Si el usuario no tiene un carrito, crear uno nuevo
      cart = new Cart({ user, items: [] });
    }

    // Verificar si el producto existe
    const existingProduct = await Product.findOne({ _id: product });

    if (!existingProduct) {
      // Si el producto no existe, devolver un error
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items.find((item) =>
      item.product.equals(product)
    );

    if (existingItem) {
      // Si el producto ya está en el carrito, actualizar la cantidad
      existingItem.quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo como un nuevo elemento
      cart.items.push({ product, quantity });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Obtener el carro del que este login
router.get('/cart/user', auth, async (req, res) => {
  try {
    const userId = req.userData.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener el carrito de compras de un usuario
router.get('/cart/:userId', auth, async (req, res) => {
  const userData = await userSchema.findById(req.userData.user._id);
  if (userData.type === 'Admin') {
    try {
      const userId = req.params.userId;
      const cart = await Cart.findOne({ user: userId })
        .populate('user')
        .populate('items.product');
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(401)
      .json({ message: 'No cumples con los permisos para hacer esta acción ' });
  }
});

// Eliminar un producto del carrito
router.delete('/cart/:userId/:productId', auth, async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    cart.items = cart.items.filter((item) => !item.product.equals(productId));
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los carritos de compras
router.get('/cart', auth, async (req, res) => {
  try {
    const carts = await Cart.find().populate('items.product');
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar la cantidad de producto in cart, pide userid y itemid
router.put('/cart/:userId/:itemId', auth, async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });
    const item = cart.items.find((item) => item._id.equals(itemId));
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar carrito de compras
router.delete('/cart/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.json({ message: 'Cart deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
/**
 * @swagger
 * paths:
 *   /api/cart/add:
 *     post:
 *       tags: [Cart]
 *       summary: Add a product to the user's cart
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
 *                 product:
 *                   type: string
 *                   description: The ID of the product to add to the cart
 *                 quantity:
 *                   type: integer
 *                   description: The quantity of the product to add
 *                   minimum: 1
 *               required:
 *                 - product
 *                 - quantity
 *       responses:
 *         '200':
 *           description: Product added to the cart successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Cart'
 *         '401':
 *           description: Unauthorized - The provided JWT token is invalid or expired
 *         '404':
 *           description: Product not found
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/cart/user:
 *     get:
 *       tags: [Cart]
 *       summary: Get the cart of the logged-in user
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: The JWT token for authentication
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved the user's cart
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Cart'
 *         '401':
 *           description: Unauthorized - The provided JWT token is invalid or expired
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/cart/{userId}:
 *     get:
 *       tags: [Cart]
 *       summary: Get the shopping cart of a user
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: ID of the user whose cart to retrieve
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
 *           description: Successfully retrieved the user's shopping cart
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Cart'
 *         '401':
 *           description: Unauthorized - The provided JWT token is invalid or expired, or the user does not have the required permissions
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/cart/{userId}/{itemId}:
 *     put:
 *       tags: [Cart]
 *       summary: Update the quantity of a product in the user's shopping cart
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: ID of the user whose cart to update
 *           required: true
 *           schema:
 *             type: string
 *         - in: path
 *           name: itemId
 *           description: ID of the cart item to update
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
 *                 quantity:
 *                   type: integer
 *                   description: The updated quantity of the product in the cart
 *                   minimum: 1
 *               required:
 *                 - quantity
 *       responses:
 *         '200':
 *           description: Quantity of the product in the cart updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Cart'
 *         '401':
 *           description: Unauthorized - The provided JWT token is invalid or expired
 *         '500':
 *           description: Internal server error
 */


/**
 * @swagger
 * paths:
 *   /api/cart/{userId}/{productId}:
 *     delete:
 *       tags: [Cart]
 *       summary: Delete a product from the user's shopping cart
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: ID of the user whose cart to update
 *           required: true
 *           schema:
 *             type: string
 *         - in: path
 *           name: productId
 *           description: ID of the product to remove from the cart
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
 *           description: Product removed from the cart successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Cart'
 *         '401':
 *           description: Unauthorized - The provided JWT token is invalid or expired
 *         '500':
 *           description: Internal server error
 */



/**
 * @swagger
 * paths:
 *   /api/cart/{id}:
 *     delete:
 *       tags: [Cart]
 *       summary: Delete a shopping cart
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the shopping cart to delete
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
 *           description: Shopping cart deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '401':
 *           description: Unauthorized - The provided JWT token is invalid or expired
 *         '500':
 *           description: Internal server error
 */