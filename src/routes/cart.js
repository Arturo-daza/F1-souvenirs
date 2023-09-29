const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product= require("../models/product")

// Agregar un producto al carrito
router.post('/cart/add', async (req, res) => {
  try {
    const { user, product, quantity } = req.body;
    
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
    const existingItem = cart.items.find(item => item.product.equals(product));
    
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

// Obtener el carrito de compras de un usuario
router.get('/cart/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ user: userId }).populate('user').populate('items.product');
    console.log(cart)
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un producto del carrito
router.delete('/cart/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los carritos de compras
router.get('/cart', async (req, res) => {
  try {
    const carts = await Cart.find().populate('items.product');
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar la cantidad de producto in cart, pide userid y itemid
router.put('/cart/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });
    const item = cart.items.find(item => item._id.equals(itemId));
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// Eliminar carrito de compras
router.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.json({ message: 'Cart deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports= router