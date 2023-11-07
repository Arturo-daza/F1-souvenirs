const express = require('express');
const router = express.Router();
const cartSchema = require('../models/cart');
const orderSchema = require('../models/order');
const auth = require('./auth-validation');

// Ruta para que los compradores realicen un pedido desde su carrito
router.post('/cart/order-checkout', auth, async (req, res) => {
  const { userId } = req.body; // Suponiendo que el usuario actual está autenticado y su ID se pasa en el cuerpo de la solicitud
  try {
    // Buscar el carrito del usuario
    const cart = await cartSchema
      .findOne({ user: userId })
      .populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Crear un nuevo pedido
    const order = new orderSchema({
      user: userId,
      items: cart.items,
      totalAmount: cart.items.reduce(
        (total, item) => total + item.product.precio * item.quantity,
        0
      ),
    });

    // Guardar el pedido y vaciar el carrito
    await order.save();
    await cart.updateOne({ $set: { items: [] } });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
