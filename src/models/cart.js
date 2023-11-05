const mongoose = require('mongoose');
/**
 * @swagger
 *components:
 *  schemas:
 *    CartItem:
 *      type: object
 *      properties:
 *        product:
 *          type: string
 *          description: The ID of the related product
 *        quantity:
 *          type: integer
 *          description: The quantity of the product in the cart
 *          minimum: 1
 *      required:
 *        - product
 *        - quantity
 *
 *    Cart:
 *      type: object
 *      properties:
 *        user:
 *          type: string
 *          description: The ID of the related user
 *        items:
 *          type: array
 *          description: An array of cart items
 *          items:
 *            $ref: '#/components/schemas/CartItem'
 *      required:
 *        - user
 *        - items
 *

 */
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Nombre del modelo de producto relacionado
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // La cantidad mínima debe ser 1
  },
});

// pendiente definir el esquema del user

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Nombre del modelo de usuario relacionado
    required: true,
  },
  items: [cartItemSchema], // Un array de elementos del carrito
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
