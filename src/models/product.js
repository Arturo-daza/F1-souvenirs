const mongoose = require("mongoose");

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
// genera el  el endpoint post para ingresar nuevo producto 
// genera el endpoint get para obtener todos los productos
// genera el endpoint get para obtener un producto por id
// genera el endpoint put para actualizar un producto por id
// genera el endpoint delete para eliminar un producto por id
// genera el endpoint get para obtener todos los productos por categoria
// genera el endpoint get para obtener todos los productos por vendedor
// genera el endpoint get para obtener todos los productos por fecha de creacion

