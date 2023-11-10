const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router(); //manejador de rutas de express
const userSchema = require('../models/user');

const jwt = require('jsonwebtoken');

const auth = require('./auth-validation');

// create user

//registro de usuarios
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Endpoint for signing up a new user
 *     description: This endpoint creates a new user in the database and returns a JSON Web Token (JWT) for authentication. The request body must contain the user's first name, last name, email, password, and type (admin or regular).
 *     tags: [User]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *           examples:
 *             valid:
 *               value: { "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "password": "123456", "type": "regular" }
 *               summary: A valid request
 *             invalid:
 *               value: { "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "password": "123456" }
 *               summary: An invalid request (missing type)
 *     responses:
 *       201:
 *         description: User successfully created and assigned a token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *                   description: A flag indicating if the authentication was successful
 *                 token:
 *                   type: string
 *                   description: The JWT for the user
 *             examples:
 *               success:
 *                 value: { "auth": true, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjQyMjE2ZjQ0MzQ0MDAxNzQyZjQyZSIsImlhdCI6MTYyNjY0MjQ3MiwiZXhwIjoxNjI2NjQ2MDcyfQ.0q7h4ZxY3b0xV0g7l0Z7x0gZ8aQ7mQnY6FZLZy2yY0Q" }
 *                 summary: A successful response
 *       500:
 *         description: Error saving the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for saving the user
 *             examples:
 *               failure:
 *                 value: { "message": "Error al guardar el usuario." }
 *                 summary: A failure response
 */
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, type } = req.body;

  // validate user unique email
  const user = await userSchema.findOne({ email: email });
  if (user)
    return res.status(400).json({
      message: 'El correo ya está registrado.',
    });

  const user1 = new userSchema({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    type: type,
  });
  user1
    .encryptpass(user1.password)
    .then((encryptedPassword) => {
      user1.password = encryptedPassword;
      return user1.save();
    })
    .then(() => {
      res.status(201).json({
        message: 'Usuario creado exitosamente.',
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({
        message: 'Error al guardar el usuario.',
      });
    });
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Endpoint for logging in an existing user
 *     description: This endpoint validates the user's credentials and returns a JSON Web Token (JWT) for authentication. The request body must contain the user's email and password.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *           examples:
 *             valid:
 *               value: { "email": "john.doe@example.com", "password": "123456" }
 *               summary: A valid request
 *             invalid:
 *               value: { "email": "john.doe@example.com", "password": "wrong" }
 *               summary: An invalid request (wrong password)
 *     responses:
 *       200:
 *         description: User successfully logged in and assigned a token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   description: An error message if any
 *                 data:
 *                   type: string
 *                   description: A welcome message for the user
 *                 token:
 *                   type: string
 *                   description: The JWT for the user
 *             examples:
 *               success:
 *                 value: { "error": null, "data": "Bienvenido(a)", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZjQyMjE2ZjQ0MzQ0MDAxNzQyZjQyZSIsImlhdCI6MTYyNjY0MjQ3MiwiZXhwIjoxNjI2NjQ2MDcyfQ.0q7h4ZxY3b0xV0g7l0Z7x0gZ8aQ7mQnY6FZLZy2yY0Q" }
 *                 summary: A successful response
 *       400:
 *         description: Bad request (invalid email or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message for the bad request
 *             examples:
 *               invalid_email:
 *                 value: { "error": "user no encontrado" }
 *                 summary: An invalid email
 *               invalid_password:
 *                 value: { "error": "password no válida" }
 *                 summary: An invalid password
 */
router.post('/login', async (req, res) => {
  // validaciones
  const { error } = userSchema.validate(req.body.email, req.body.password);
  if (error) return res.status(400).json({ message: error.details[0].message });
  //Buscando el user por su dirección de email
  const user = await userSchema.findOne({ email: req.body.email });
  //validando si no se encuentra
  if (!user) return res.status(400).json({ message: 'user no encontrado' });
  //Transformando la contraseña a su valor original para
  //compararla con la pass que se ingresa en el inicio de sesión
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).json({ message: 'password no válida' });

  const token = jwt.sign({ user: user }, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  res.json({
    error: null,
    message: 'Bienvenido(a)',
    token,
  });
});
//conseguir todos los ususarios

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: This endpoint returns a list of all users in the database. If the user is an admin, they can see all the users' details. If the user is a regular user, they can only see their own type. The endpoint requires a valid JSON Web Token (JWT) for authentication.
 *     tags: [User]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: The type of the current user
 *                 users:
 *                   type: array
 *                   description: The list of users (only for admin users)
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for unauthorized access
 *             example:
 *               message: No tienes permiso para acceder a este endpoint.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for internal server error
 *             example:
 *               message: Error al obtener los usuarios.
 */
//conseguir todos los ususarios
router.get('/user', auth, async (req, res) => {
  //auth es un middleware que verifica si el token es válido y guarda los datos del usuario en req.userData
  try {
    const user = await userSchema.findById(req.userData.id); //Este es el user que esta haciendo la petición, con el cual esta el Token
    console.log(user.type);
    if (user) {
      if (user.type === 'Admin') {
        const users = await userSchema.find();
        res.json({
          user: user.type,
          users,
        });
      } else {
        res.json({
          user: user.type,
        });
      }
    } else {
      //El token no es válido o el usuario no existe
      res.status(401).json({
        message: 'No tienes permiso para acceder a este endpoint.',
      });
    }
  } catch (error) {
    //Ocurrió un error al consultar la base de datos
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener los usuarios.',
    });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: This endpoint returns a user object with the specified ID. The endpoint requires a valid JSON Web Token (JWT) for authentication.
 *     tags: [User]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for unauthorized access
 *             example:
 *               message: No tienes permiso para acceder a este endpoint.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for user not found
 *             example:
 *               message: No se encontró el usuario con el ID especificado.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error
 *             example:
 *               error: Error al obtener el usuario.
 */
//conseguir un usuario
router.get('/user/:id', auth, async (req, res) => {
  //auth es un middleware que verifica si el token es válido y guarda los datos del usuario en req.userData
  const userData = await userSchema.findById(req.userData.id);
  try {
    let user;
    if (userData.type === 'Admin') {
      user = await userSchema.findById(req.params.id);
    } else {
      user = await userSchema.findById(req.userData.id);
    }
    if (user) {
      //El usuario existe y se devuelve con el código de estado 200 y el mensaje de éxito
      res.status(200).json({
        message: 'Usuario obtenido con éxito.',
        user: user,
      });
    } else {
      //El usuario no existe y se devuelve el código de estado 404 y el mensaje de error
      res.status(404).json({
        message: 'No se encontró el usuario con el ID especificado.',
      });
    }
  } catch (error) {
    //Ocurrió un error al consultar la base de datos y se devuelve el código de estado 500 y el mensaje de error
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener el usuario.',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: This endpoint updates a user object with the specified ID and the data provided in the request body. The endpoint requires a valid JSON Web Token (JWT) for authentication. If the user is an admin, they can update any user. If the user is a regular user, they can only update themselves.
 *     tags: [User]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *             valid:
 *               value: { "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "password": "123456", "type": "Vendedor" }
 *               summary: A valid request
 *             invalid:
 *               value: { "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "password": "123456" }
 *               summary: An invalid request (missing type)
 *     responses:
 *       200:
 *         description: Successfully updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message for updating the user
 *             example:
 *               message: Usuario actualizado exitosamente.
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for unauthorized access
 *             example:
 *               message: No tienes permiso para acceder a este endpoint.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for user not found
 *             example:
 *               message: Usuario no encontrado.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error
 *             example:
 *               error: Error al actualizar el usuario.
 */
// actualiza un usuario, si es admin puede actualizar a todos, si es otro solo se puede actualizar asi mismo
router.put('/user/:id', auth, async function updateUser(req, res) {
  const { firstName, lastName, email, password, type } = req.body;

  const user = await userSchema.findById(req.userData.id);
  if (user) {
    if (user.type === 'Admin') {
      const user1 = await userSchema.findById(req.params.id); // find the user by id
      if (user1) {
        user1.firstName = firstName;
        user1.lastName = lastName;
        user1.email = email;
        user1.password = await user1.encryptpass(password);
        user1.type = type;
        await user1.save(); //save the updated user

        res.status(200).json({
          message: 'Usuario actualizado exitosamente.',
        });
      } else {
        res.status(404).json({
          message: 'Usuario no encontrado.',
        });
      }
    } else if (user.id === req.params.id) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = await user.encryptpass(password);
      user.type = type;
      await user.save(); //save the updated user
      res.status(200).json({
        message: 'Usuario actualizado exitosamente.',
      });
    } else {
      res.status(401).json({
        message: 'No tienes permiso para acceder a este endpoint.',
      });
    }
  } else {
    //El token no es válido o el usuario no existe
    res.status(401).json({
      message: 'No tienes permiso para acceder a este endpoint.',
    });
  }
});

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: This endpoint deletes a user object with the specified ID from the database. The endpoint requires a valid JSON Web Token (JWT) for authentication. If the user is an admin, they can delete any user. If the user is a regular user, they can only delete themselves.
 *     tags: [User]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message for deleting user
 *             example:
 *               message: Usuario eliminado exitosamente.
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message for unauthorized access
 *             example:
 *               message: No tienes permiso para acceder a este endpoint.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error
 *             example:
 *               error: Error al eliminar el usuario.
 */
// Eliminar un usuario
router.delete('/user/:id', auth, async (req, res) => {
  const user = await userSchema.findById(req.userData.id);

  if (user) {
    if (user.type === 'Admin') {
      await userSchema
        .findByIdAndDelete(req.params.id)
        .then(() => {
          res.json({
            message: 'Usuario eliminado exitosamente.',
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: 'Error al eliminar el usuario.',
          });
        });
    } else if (user.id === req.params.id) {
      await userSchema
        .findByIdAndDelete(req.params.id)
        .then(() => {
          res.json({
            message: 'Usuario eliminado exitosamente.',
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: 'Error al eliminar el usuario.',
          });
        });
    } else {
      res.status(401).json({
        message: 'No tienes permiso para acceder a este endpoint.',
      });
    }
  } else {
    res.status(401).json({
      message: 'No tienes permiso para acceder a este endpoint.',
    });
  }
});

router.get('/verify', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1] || '';
  if (!token) return res.send(false);

  jwt.verify(token, process.env.SECRET, async (error, user) => {
    if (error) return res.status(401).json({ error: 'Token no válido' });

    const userFound = await userSchema.findById(user.user._id);
    if (!userFound) return res.status(401).json({ error: 'Usuario no válido' });

    return res.json({
      id: userFound._id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
      type: userFound.type,
    });
  });
});

router.get('/logout', (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
