const express = require('express');
const router = express.Router();
const reviewSchema = require('../models/review');
const roductSchema = require('../models/product');
const userSchema = require("../models/user")

// Endpoint para crear una nueva revisión, con valización de que exista el usuario y el producto
router.post('/review', async (req, res) => {
    const { user, product, rating, comment } = req.body;
    const review = new reviewSchema({ user, product, rating, comment });
    const userExists = await userSchema.findById(user);
    const productExists = await roductSchema.findById(product);
    if (!userExists) return res.status(400).send('Usuario no existe');
    if (!productExists) return res.status(400).send('Producto no existe');
    const savedReview = await review.save();
    res.status(201).send(savedReview);
});

// Endpoint para obtener todas las revisiones
router.get('/review', async (req, res) => {
    const review = await reviewSchema.find().populate('user', 'name').populate('product', 'name');
    res.send(review);
});

module.exports = router;
