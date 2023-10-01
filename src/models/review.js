const mongoose = require('mongoose');
/**
 * @swagger
* components:
*   schemas:
*     Review:
*       type: object
*       properties:
*         user:
*           type: string
*           description: The ID of the user who created the review
*         product:
*           type: string
*           description: The ID of the product being reviewed
*         rating:
*           type: number
*           description: The rating given by the user (1-5)
*         comment:
*           type: string
*           description: The comment or review text
*       required:
*         - user
*         - product
*         - rating
*         - comment

 */
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo de usuario
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Referencia al modelo de producto
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
