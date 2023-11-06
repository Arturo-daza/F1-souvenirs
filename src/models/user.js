const mongoose = require('mongoose'); // importando el componente mongoose
const bcrypt = require('bcrypt'); // importando el componente bcrypt
/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          description: A user in the system, with a username, email, password, and type.
 *          properties:
 *              firstName:
 *                  type: string
 *                  description: The first name of the user
 *                  required: true
 *                  trim: true
 *              lastName:
 *                  type: string
 *                  description: The last name of the user
 *                  required: true
 *                  trim: true
 *              user:
 *                  type: string
 *                  description: The username of the user
 *                  required: true
 *              email:
 *                  type: string
 *                  description: The email of the user
 *                  required: true
 *                  unique: true
 *                  format: email
 *              pass:
 *                  type: string
 *                  description: The password of the user
 *                  required: true
 *                  format: password
 *              type:
 *                  type: string
 *                  enum:
 *                      - Vendedor
 *                      - Comprador
 *                      - Admin
 *                  description: The type of user (e.g., Vendedor, Comprador, Admin)
 *                  required: true
 *          required:
 *              - firstName
 *              - lastName
 *              - user
 *              - email
 *              - pass
 *              - type 
 *          example:
 *              firstName: John
 *              lastName: Doe
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
