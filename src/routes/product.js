const express = require("express");
const router = express.Router(); //manejador de rutas de express
const productSchema = require("../models/product.js");
//Nuevo product
router.post("/product", (req, res) => {
    const product = productSchema(req.body);
    product
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Obtener todos los products
router.get("/product", (req, res) => {
    productSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

// consult by category
router.get("/categoria/:categoria", (req, res) => {
    const { categoria } = req.params;
    productSchema.find({categoria: categoria})
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// consult by id
router.get("/product/:id", (req, res) => {
    const { id } = req.params;
    productSchema.findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


// Ruta para actualizar una product por su ID
router.put('/product/:id', (req, res) => {
    const {id} = req.params; 
    const {nombre, descripcion, precio, imagen, vendedor, categoria} = req.body
    Product.updateOne({_id: id}, {
        $set  : {nombre, descripcion, precio, imagen, vendedor, categoria}
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Eliminar un product por su id
router.delete("/product/:id", (req, res) => {
    const {id} = req.params; 
    productSchema
    .findByIdAndDelete(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
}); 

module.exports = router;
