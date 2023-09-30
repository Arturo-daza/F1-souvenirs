const express = require('express');
const router = express.Router();
const reviewSchema = require('../models/review');
const roductSchema = require('../models/product');
const userSchema = require("../models/user")

// Endpoint para crear una nueva revisión, con validación de que exista el usuario y el producto
router.post('/review', async (req, res) => {
    const { user, product, rating, comment } = req.body;
    const review = new reviewSchema({ user, product, rating, comment });
    const userExists = await userSchema.findById(user);
    const productExists = await roductSchema.findById(product);
    if (!userExists) return res.status(400).send('Usuario no existe');
    if (!productExists) return res.status(400).send('Producto no existe');
    //genera una validación de que el comentario es unico por cada usuario al producto
    const reviewExists = await reviewSchema.findOne({ user, product });
    if (reviewExists) return res.status(400).send('Ya existe una revisión para este producto');
    try{
        const savedReview = await review.save();
        res.status(201).send(savedReview);
    }catch(error){
        res.status(500).send("Error interno del servidor");
    }

});

// Endpoint para obtener todas las revisiones
router.get('/review', async (req, res) => {
    const review = await reviewSchema.find().populate('user', 'user').populate('product', 'nombre');
    res.send(review);
});

module.exports = router;
