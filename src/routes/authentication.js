const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router(); //manejador de rutas de express
const userSchema = require('../models/user');

// creawte user

//registro de usuarios
/**
 * @swagger
 * /api/signup:
 *       post:
 *           summary: Endpoint for signing up a new user
 *           tags: [User]
 *           requestBody:
 *               required: true
 *               content:
 *                    application/json:
 *                        schema:
 *                            type: object
 *                            $ref: '#/components/schemas/User'
 *           responses:
 *               200:
 *                   description: User successfully saved
 *                   content:
 *                       application/json:
 *                             schema:
 *                                 type: object
 *                                 properties:
 *                                 message:
 *                                     type: string
 *                                     description: Success message for saving the user
 *                             example:
 *                                 message: User saved.
 *               500:
 *                   description: Error saving the user
 *                   content:
 *                       application/json:
 *                            schema:
 *                                type: object
 *                                properties:
 *                                message:
 *                                    type: string
 *                                    description: Error message for saving the user
 *                            example:
 *                                message: Error saving the user.
 */
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, type } = req.body;
    const user1 = new userSchema({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      type: type,
    });
    user1.password = await user1.encryptpass(user1.password);
    await user1.save(); //save es un método de mongoose para guardar datos en MongoDB
    res.status(201).json({
      message: 'Usuario guardado.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al guardar el usuario.',
    });
  }
});

//inicio de sesión
router.post('/login', async (req, res) => {
  // validaciones
  const { error } = userSchema.validate(req.body.email, req.body.password);
  if (error) return res.status(400).json({ error: error.details[0].message }); //Buscando el user por su dirección de email
  const user = await userSchema.findOne({ email: req.body.email });
  //validando si no se encuentra
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); //Transformando la contraseña a su valor original para //compararla con la password que se ingresa en el inicio de sesión
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(401).json({ error: 'Contraseña no válida' });
  res.json({
    error: null,
    data: 'Bienvenido(a)',
  });
});

//conseguir todos los ususarios
router.get('/user', async (req, res) => {
  const users = await userSchema.find();
  res.json(users);
});

//conseguir un usuario
router.get('/user/:id', async (req, res) => {
  const user = await userSchema.findById(req.params.id);
  res.json(user);
});

router.put('/user/:id', async function updateUser(req, res) {
  const { user, email, password, type } = req.body;
  const user1 = await userSchema.findById(req.params.id); // find the user by id

  if (user1) {
    user1.user = user;
    user1.email = email;
    user1.password = await user1.encryptpass(password);
    user1.type = type;

    await user1.save(); //save the updated user

    res.json({
      message: 'user actualizado.',
    });
  } else {
    res.status(404).json({
      message: 'user no encontrado.',
    });
  }
});

// Eliminar un usuario
router.delete('/user/:id', async (req, res) => {
  await userSchema.findByIdAndDelete(req.params.id);
  res.json({
    message: 'user eliminado.',
  });
});

// Conseguir usuarios por type
router.get('/user/type/:type', async (req, res) => {
  const user = await userSchema.find({ type: req.params.type });
  res.json(user);
});

module.exports = router;
