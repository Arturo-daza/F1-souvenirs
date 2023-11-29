const express = require('express');
const router = express.Router();
const orderSchema = require('../models/order');
const userSchema = require('../models/user');
const auth = require('./auth-validation');

// Ruta para que los compradores realicen un pedido desde su carrito
router.post('/order-checkout', auth, async (req, res) => {
  const { user, items, totalAmount } = req.body; // Suponiendo que el usuario actual está autenticado y su ID se pasa en el cuerpo de la solicitud
  try {
    // Crear un nuevo pedido
    const order = new orderSchema({
      user: user,
      items: items,
      totalAmount: totalAmount,
    });

    // Guardar el pedido y vaciar el carrito
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  const user = await userSchema.findById(req.userData.user._id); // Suponiendo que el usuario actual está autenticado y su ID se pasa en el cuerpo de la solicitud
  try {
    // Buscar el pedido del usuario
    const order = await orderSchema.find({ user: user._id }).populate('items.product').sort({ createdAt: -1 });
    if (!order) {
      return res.status(200);
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
/**
 * @swagger
 * paths:
 *   /cart/order-checkout:
 *     post:
 *       tags: [Order]
 *       summary: Place an order from the shopping cart
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
 *                 userId:
 *                   type: string
 *                   description: The ID of the user placing the order
 *               required:
 *                 - userId
 *       responses:
 *         '200':
 *           description: Order placed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Order'
 *         '404':
 *           description: Cart not found for the specified user
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/my-orders:
 *     get:
 *       tags: [Order]
 *       summary: Get orders for the authenticated user
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '200':
 *           description: List of orders retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Order'
 *         '500':
 *           description: Internal server error
 */
