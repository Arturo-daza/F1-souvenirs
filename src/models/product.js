const mongoose = require("mongoose");
/**
* @swagger
* components:
*   schemas:
*     Product:
*       type: object
*       properties:
*         nombre:
*           type: string
*           description: The name of the product
*         descripcion:
*           type: string
*           description: The description of the product
*         precio:
*           type: number
*           format: double
*           description: The price of the product
*         imagen:
*           type: string
*           format: uri
*           description: The URL of the product image
*         vendedor:
*           type: string
*           description: The ID of the seller
*         categoria:
*           type: string
*           description: The category of the product
*         fechaCreacion:
*           type: string
*           format: date-time
*           description: The creation date of the product
*       required:
*         - nombre
*         - descripcion
*         - precio
*         - imagen
*         - vendedor
*         - categoria
*         - fechaCreacion
 */


const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true, // Elimina espacios en blanco al principio y al final
    },
    descripcion: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    imagen: {
        type: String, // Puedes almacenar la URL de la imagen
        required: true,
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referencia al modelo de Usuario para identificar al vendedor
        required: true,
    },
    categoria: {
        type: String, // Puedes definir una lista de categorías válidas
        required: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    });

const product = mongoose.model("Product", productSchema);

module.exports = product;
