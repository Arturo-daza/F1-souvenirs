const express = require('express');
const router = express.Router(); //manejador de rutas de express
const User = require('../models/user'); // Importa el modelo User
const productSchema = require('../models/product.js');
const verifyToken = require("./validate_token")

//Nuevo product
router.post('/products', verifyToken,  (req, res) => {
  // Obtén los datos del producto del cuerpo de la solicitud (req.body)
  const { name, description, price, image, seller, category } = req.body;

  // Verifica si el seller existe en la base de datos
  User.findById(seller)
    .then((vendedorExistente) => {
      if (!vendedorExistente) {
        return res
          .status(400)
          .json({ error: 'El seller no existe en el sistema.' });
      }

      // Crea una nueva instancia de Product
      const nuevoProducto = new productSchema({
        name,
        description,
        price,
        image,
        seller,
        category,
      });

      // Guarda el producto en la base de datos
      nuevoProducto.save()
        .then((productoGuardado) => {
          // Respuesta exitosa
          res.status(201).json(productoGuardado);
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
router.get('/products',  (req, res) => {
  productSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// consult by id
router.get('/products/:id', (req, res) => {
  const { id } = req.params;
  productSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Ruta para actualizar una product por su ID
router.put('/products/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, seller, category } = req.body;
  productSchema
    .updateOne(
      { _id: id },
      {
        $set: { name, description, price, image, seller, category },
      }
    )
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Eliminar un product por su id
router.delete('/products/:id',verifyToken, (req, res) => {
  const { id } = req.params;
  productSchema
    .findByIdAndDelete(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// endpoint get for seller id
router.get('/products/seller/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  productSchema
    .find({ seller: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
