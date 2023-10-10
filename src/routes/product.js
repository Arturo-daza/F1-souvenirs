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
/**
 * @swagger
 * paths:
 *   /api/product:
 *     get:
 *       summary: Get all products
 *       tags: [Product]
 *       operationId: getAllProducts
 *       responses:
 *         '200':
 *           description: Successfully retrieved products
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Product'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for internal server error
 *                 example:
 *                   message: Error to obtain all the products.
 */
    router.get("/product", (req, res) => {
        productSchema
            .find()
            .then((data) => res.json(data))
            .catch((error) => res.status(500).json({ message: "Error to obtain all the products" }));
    });

// consult by category
/**
 * @swagger
 * paths:
 *   /api/categoria/{categoria}:
 *     get:
 *       summary: Get products by category
 *       tags: [Product]
 *       operationId: getProductsByCategory
 *       parameters:
 *         - in: path
 *           name: categoria
 *           required: true
 *           schema:
 *             type: string
 *           description: The category of products to retrieve
 *       responses:
 *         '200':
 *           description: Successfully retrieved products by category
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Product'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for internal server error
 *                 example:
 *                   message: Error.
 */
router.get("/categoria/:categoria", (req, res) => {
    const { categoria } = req.params;
    productSchema
        .find({ categoria: categoria })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// consult by id
/**
 * @swagger
 * paths:
 *   /api/product/{id}:
 *     get:
 *       summary: Get a product by ID
 *       tags: [Product]
 *       operationId: getProductById
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the product
 *       responses:
 *         '200':
 *           description: Successfully retrieved product by ID
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *         '404':
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for product not found
 *                 example:
 *                   message: Product not found.
 */
router.get("/product/:id", (req, res) => {
    const { id } = req.params;
    productSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: `{error} + Product not found`  }));
});

// Update a product for id
/**
 * @swagger
 * paths:
 *   /api/product/{id}:
 *     put:
 *       summary: Update a product by ID
 *       tags: [Product]
 *       operationId: updateProductById
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the product to update
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       responses:
 *         '200':
 *           description: Successfully updated product
 *           content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for internal server error
 *                 example:
 *                   message: Error.
 */

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

//Delete a product by id
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API endpoints for managing products
 * 
 * paths:
 *   /api/product/{id}:
 *     delete:
 *       summary: Delete a product by ID
 *       tags: [Product]
 *       operationId: deleteProductById
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the product to delete
 *       responses:
 *         '200':
 *           description: Successfully deleted product
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Product'
 *         '404':
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for product not found
 *                 example:
 *                   message: Product not found.
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for internal server error
 *                 example:
 *                   message: An error occurred while deleting the product.
 */
router.delete("/api/product/:id", (req, res) => {
    const { id } = req.params;
    productSchema
        .findByIdAndDelete(id)
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: "Product not found." });
            }
        })
        .catch((error) => res.status(500).json({ message: "An error occurred while deleting the product." }));
});

// endpoint get for vendedor id
/**
 * @swagger
 * paths:
 *   /api/product/vendedor/{id}:
 *     get:
 *       summary: Get products by vendor ID
 *       tags: [Product]
 *       operationId: getProductsByVendorId
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the vendor to retrieve products for
 *       responses:
 *         '200':
 *           description: Successfully retrieved products by vendor ID
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Product'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for internal server error
 *                 example:
 *                   message: Error.
 */

router.get("/api/product/vendedor/:id", (req, res) => {
    const { id } = req.params;
    productSchema
        .find({ vendedor: id })
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;
