const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       description: A product that can be sold on the platform
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product
 *           example: "Libro de programación"
 *         description:
 *           type: string
 *           description: The description of the product
 *           example: "Un libro que enseña los fundamentos de la programación en JavaScript"
 *         price:
 *           type: number
 *           format: double
 *           description: The price of the product in Colombian pesos
 *           example: 50000
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the product image
 *           example: "https://example.com/libro.jpg"
 *         seller:
 *           type: string
 *           description: The ID of the seller who owns the product
 *           example: "5f9a1c3b8a1e2c0017f6a8b2"
 *         category:
 *           type: string
 *           description: The ID of the category that the product belongs to
 *           example: "5f9a1c3b8a1e2c0017f6a8b4"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the product
 *           example: "2023-11-05T19:25:36.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The update date of the product
 *           example: "2023-11-05T19:25:36.000Z"
 *       required:
 *         - name
 *         - description
 *         - price
 *         - image
 *         - seller
 *         - category
 *       example:
 *          name: "Laptop"
 *          description: "Un portátil de alta gama con 16 GB de RAM y 512 GB de SSD"
 *          price: 1499.99
 *          image: "https://example.com/images/laptop.jpg"
 *          seller: "5f9a8c7d4f2b3a0017e8c8e4"
 *          category: "5f9a8c7d4f2b3a0017e8c8e5"
 *          createdAt: "2023-11-05T19:25:36.000Z"
 *          updatedAt: "2023-11-05T19:25:36.000Z"

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
      type: String, //  almacenar la URL de la image
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia al modelo de Usuario para identificar al seller
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const product = mongoose.model("Product", productSchema);

module.exports = product;
