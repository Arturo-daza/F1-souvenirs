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
  if (!review) return res.status(404).send('Review not exists');
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
  if (!review) return res.status(404).send('Review not exists');
  res.status(204).send('Review Updated');
});

// Endpoint DELETE
router.delete('/review/:id', auth, async (req, res) => {
  const review = await reviewSchema.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).send('Review not exists');
  res.status(200).send('Review deleted');
});

// Endpoint get for userid
router.get('/review/user/:id', async (req, res) => {
  const review = await reviewSchema
    .find({ user: req.params.id })
    .populate('user', 'user')
    .populate('product', 'nombre');
  if (!review) return res.status(404).send('Review not exists');
  res.send(review);
});

// Endpoint get for product id
router.get('/review/product/:id', async (req, res) => {
  const review = await reviewSchema
    .find({ product: req.params.id })
    .populate('user', 'firstName lastName')
    .populate('product', 'nombre');
  if (!review) return res.status(404).send('Review not exists');
  res.send(review);
});

module.exports = router;
/**
 * @swagger
 * paths:
 *   /api/review:
 *     post:
 *       tags: [Review]
 *       summary: Create a new review with user and product validation
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           description: The JWT token for authentication
 *           required: true
 *           type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: The ID of the user who created the review
 *                 product:
 *                   type: string
 *                   description: The ID of the product being reviewed
 *                 rating:
 *                   type: number
 *                   description: The rating given by the user (1-5)
 *                 comment:
 *                   type: string
 *                   description: The comment or review text
 *               required:
 *                 - user
 *                 - product
 *                 - rating
 *                 - comment
 *       responses:
 *         '201':
 *           description: Review created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Review'
 *         '400':
 *           description: Bad request - User or Product does not exist, or a review already exists for the user and product
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/review:
 *     get:
 *       tags: [Review]
 *       summary: Get all reviews
 *       responses:
 *         '200':
 *           description: Successfully retrieved all reviews
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Review'
 *         '500':
 *           description: Internal server error
 */


/**
 * @swagger
 * paths:
 *   /api/review/{id}:
 *     get:
 *       tags: [Review]
 *       summary: Get a review by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the review to retrieve
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved the review
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Review'
 *         '404':
 *           description: Review not found
 *         '500':
 *           description: Internal server error
 */

/**
 * @swagger
 * paths:
 *   /api/review/{id}:
 *     put:
 *       tags: [Review]
 *       summary: Update a review by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the review to update
 *           required: true
 *           schema:
 *             type: string
 *         - in: header
 *           name: Authorization
 *           description: The JWT token for authentication
 *           required: true
 *           type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: The ID of the user who created the review
 *                 product:
 *                   type: string
 *                   description: The ID of the product being reviewed
 *                 rating:
 *                   type: number
 *                   description: The rating given by the user (1-5)
 *                 comment:
 *                   type: string
 *                   description: The comment or review text
 *               required:
 *                 - user
 *                 - product
 *                 - rating
 *                 - comment
 *       responses:
 *         '204':
 *           description: Review updated successfully
 *         '404':
 *           description: Review not found
 *         '500':
 *           description: Internal server error
 */


/**
 * @swagger
 * paths:
 *   /api/review/{id}:
 *     delete:
 *       tags: [Review]
 *       summary: Delete a review by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of the review to delete
 *           required: true
 *           schema:
 *             type: string
 *         - in: header
 *           name: Authorization
 *           description: The JWT token for authentication
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: Review deleted successfully
 *         '404':
 *           description: Review not found
 *         '500':
 *           description: Internal server error
 */


/**
 * @swagger
 * paths:
 *   /api/product/{productId}/averageRating:
 *     get:
 *       tags: [Product]
 *       summary: Get the average rating for a product
 *       parameters:
 *         - in: path
 *           name: productId
 *           description: ID of the product to calculate the average rating
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved the average rating
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   averageRating:
 *                     type: number
 *         '404':
 *           description: No reviews found for the specified product
 *         '500':
 *           description: Internal server error
 */