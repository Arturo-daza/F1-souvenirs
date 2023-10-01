const mongoose = require('mongoose');
/**
 * @swagger
 *components:
 *  schemas:
 *    Order:
 *      type: object
 *      properties:
 *        user:
 *          type: string
 *          description: The ID of the related user
 *        items:
 *          type: array
 *          description: An array of order items
 *          items:
 *            type: object
 *            properties:
 *              product:
 *                type: string
 *                description: The ID of the related product
 *              quantity:
 *                type: integer
 *                description: The quantity of the product in the order
 *                minimum: 1
 *          minItems: 1
 *        totalAmount:
 *          type: number
 *          description: The total amount of the order
 *        orderDate:
 *          type: string
 *          format: date-time
 *          description: The date of the order
 *      required:
 *        - user
 *        - items
 *        - totalAmount
 */
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    items: [
        {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
