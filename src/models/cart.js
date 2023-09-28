const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Nombre del modelo de producto relacionado
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // La cantidad mínima debe ser 1
  }
});
// pendiente definir el esquema del user
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Nombre del modelo de usuario relacionado
    required: true,
  },
  items: [cartItemSchema], // Un array de elementos del carrito
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
