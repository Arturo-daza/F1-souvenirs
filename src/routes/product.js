const express = require("express");
const router = express.Router(); //manejador de rutas de express
const User = require('../models/user'); // Importa el modelo User
const productSchema = require("../models/product.js");
//Nuevo product

/**
 * @swagger
 * /api/product:
 *    post:
 *       tags: [Product]
 *       summary: Create a new product
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Product'
 *       responses:
 *           '200':
 *              description: Product created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *               
 *           '400':
 *               description: Invalid request parameters
 *           '500':
 *               description: Internal server error
 */
router.post("/product", (req, res) => {
    // Obtén los datos del producto del cuerpo de la solicitud (req.body)
    const { nombre, descripcion, precio, imagen, vendedor, categoria } = req.body;

    // Verifica si el vendedor existe en la base de datos
    User.findById(vendedor)
        .then((vendedorExistente) => {
            if (!vendedorExistente) {
                return res.status(400).json({ error: "El vendedor no existe en el sistema." });
            }

            // Crea una nueva instancia de Product
            const nuevoProducto = new productSchema({
                nombre,
                descripcion,
                precio,
                imagen,
                vendedor,
                categoria,
            });

            // Guarda el producto en la base de datos
            nuevoProducto.save()
                .then((productoGuardado) => {
                    // Respuesta exitosa
                    res.status(200).json(productoGuardado);
                })
                .catch((error) => {
                    // Manejo de errores
                    res.status(400).json({ error: error.message });
                });
        })
        .catch((error) => {
            // Manejo de errores
            res.status(400).json({ error: error.message });
        });
});

//Obtener todos los products
router.get("/product", (req, res) => {
    productSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// consult by category
router.get("/categoria/:categoria", (req, res) => {
    const { categoria } = req.params;
    productSchema
        .find({ categoria: categoria })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// consult by id
router.get("/product/:id", (req, res) => {
    const { id } = req.params;
    productSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Ruta para actualizar una product por su ID
router.put("/product/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen, vendedor, categoria } = req.body;
    productSchema.updateOne(
        { _id: id },
        {
        $set: { nombre, descripcion, precio, imagen, vendedor, categoria },
        }
    )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Eliminar un product por su id
router.delete("/product/:id", (req, res) => {
    const { id } = req.params;
    productSchema
        .findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// endpoint get for vendedor id
router.get("/product/vendedor/:id", (req, res) => {
    const { id } = req.params;
    productSchema
        .find({ vendedor: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});
module.exports = router;
