const express = require('express');
const router = express.Router();
const reviewSchema = require('../models/review');
const roductSchema = require('../models/product');
const userSchema = require('../models/user');
const auth = require('./auth-validation');

// Endpoint para crear una nueva revisión, con validación de que exista el usuario y el producto
router.post('/review', auth, async (req, res) => {
  const { user, product, rating, comment } = req.body;
  const review = new reviewSchema({ user, product, rating, comment });
  const userExists = await userSchema.findById(user);
  const productExists = await roductSchema.findById(product);
  if (!userExists) return res.status(400).send('Usuario no existe');
  if (!productExists) return res.status(400).send('Producto no existe');
  //genera una validación de que el comentario es unico por cada usuario al producto
  const reviewExists = await reviewSchema.findOne({ user, product });
  if (reviewExists)
    return res.status(400).send('Ya existe una revisión para este producto');
  try {
    const savedReview = await review.save();
    res.status(201).send(savedReview);
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});

// Endpoint para obtener todas las revisiones
router.get('/review', async (req, res) => {
  const review = await reviewSchema
    .find()
    .populate('user', 'user')
    .populate('product', 'nombre');
  res.send(review);
});

// Endpoint para obtener una revisión por id
router.get('/review/:id', async (req, res) => {
  const review = await reviewSchema
    .findById(req.params.id)
    .populate('user', 'user')
    .populate('product', 'nombre');
  if (!review) return res.status(404).send('Review not exits');
  res.send(review);
});

// Endpoint PUT
router.put('/review/:id', auth, async (req, res) => {
  const { user, product, rating, comment } = req.body;
  const newReview = { user, product, rating, comment };
  const review = await reviewSchema.findByIdAndUpdate(
    req.params.id,
    newReview,
    {
      new: true,
    }
  );
  if (!review) return res.status(404).send('Review not exits');
  res.status(204).send('Review Updated');
});

// Endpoint DELETE
router.delete('/review/:id', auth, async (req, res) => {
  const review = await reviewSchema.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).send('Review not exits');
  res.status(200).send('Review deleted');
});

// Endpoint get for userid
router.get('/review/user/:id', async (req, res) => {
  const review = await reviewSchema
    .find({ user: req.params.id })
    .populate('user', 'user')
    .populate('product', 'nombre');
  if (!review) return res.status(404).send('Review not exits');
  res.send(review);
});

// Endpoint get for product id
router.get('/review/product/:id', async (req, res) => {
  const review = await reviewSchema
    .find({ product: req.params.id })
    .populate('user', 'user')
    .populate('product', 'nombre');
  if (!review) return res.status(404).send('Review not exits');
  res.send(review);
});

module.exports = router;
