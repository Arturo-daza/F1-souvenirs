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
