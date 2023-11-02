const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         price:
 *           type: number
 *           format: double
 *           description: The price of the product
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the product image
 *         seller:
 *           type: string
 *           description: The ID of the seller
 *         category:
 *           type: string
 *           description: The category of the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the product
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The update date of the product
 *       required:
 *         - name
 *         - description
 *         - price
 *         - image
 *         - seller
 *         - category
 */

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Elimina espacios en blanco al principio y al final
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // Puedes almacenar la URL de la image
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo de Usuario para identificar al seller
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Referencia al modelo de Usuario para identificar al seller
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const product = mongoose.model('Product', productSchema);

module.exports = product;
