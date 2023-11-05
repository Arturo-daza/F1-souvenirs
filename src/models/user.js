const mongoose = require('mongoose'); // importando el componente mongoose
const bcrypt = require('bcrypt'); // importando el componente bcrypt
/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              user:
 *                  type: string
 *                  description: The username of the user
 *              email:
 *                  type: string
 *                  description: The email of the user
 *              pass:
 *                  type: string
 *                  description: The password of the user
 *              type:
 *                  type: string
 *                  enum:
 *                      - Vendedor
 *                      - Comprador
 *                      - Admin
 *                  description: The type of user (e.g., Vendedor, Comprador, Admin)
 *          required:
 *              - user
 *              - email
 *              - pass
 *              - type
 *          example:
 *              user: JohnDoe
 *              email: johndoe@example.com
 *              pass: password123
 *              type: Vendedor
 */
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Vendedor', 'Comprador', 'Admin'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.encryptpass = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pass, salt);
  return hashedPassword;
};

module.exports = mongoose.model('User', userSchema);
