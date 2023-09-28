const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
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
    // vendedor: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Usuario", // Referencia al modelo de Usuario para identificar al vendedor
    //     required: true,
    // },
    categoria: {
        type: String, // Puedes definir una lista de categorías válidas
        required: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
    });

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;
