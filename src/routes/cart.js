const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Agregar un producto al carrito
router.post('/cart/add', async (req, res) => {
  try {
    const { user, product, quantity, price } = req.body;
    
    // Verificar si el usuario ya tiene un carrito
    let cart = await Cart.findOne({ user });
    
    if (!cart) {
      // Si el usuario no tiene un carrito, crear uno nuevo
      cart = new Cart({ user, items: [] });
    }xx  

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items.find(item => item.product.equals(product));
    
    if (existingItem) {
      // Si el producto ya está en el carrito, actualizar la cantidad
      existingItem.quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo como un nuevo elemento
      cart.items.push({ product, quantity, price });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports= router