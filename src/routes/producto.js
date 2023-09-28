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
})
module.exports = router;
