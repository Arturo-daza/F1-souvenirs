const express = require("express");
const router = express.Router(); //manejador de rutas de express
const productoSchema = require("../models/producto.js");
//Nuevo producto
router.post("/producto", (req, res) => {
    const producto = productoSchema(req.body);
    producto
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Obtener todos los productos
router.get("/producto", (req, res) => {
    productoSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
})

// consult by category
router.get("/categoria/:categoria", (req, res) => {
    const { categoria } = req.params;
    productoSchema.find({categoria: categoria})
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// consult by id
router.get("/producto/:id", (req, res) => {
    const { id } = req.params;
    productoSchema.findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


// Ruta para actualizar una producto por su ID
router.put('/producto/:id', (req, res) => {
    const {id} = req.params; 
    const {nombre, descripcion, precio, imagen, categoria} = req.body
    productoSchema.updateOne({_id: id}, {
        $set  : {nombre, descripcion, precio, imagen, categoria}
    })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Eliminar un producto por su id
router.delete("/producto/:id", (req, res) => {
    const {id} = req.params; 
    productoSchema
    .findByIdAndDelete(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
}); 

module.exports = router;
