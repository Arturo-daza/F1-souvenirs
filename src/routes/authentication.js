const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router(); //manejador de rutas de express
const userSchema = require("../models/user");

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
router.post("/signup", (req, res) => {
    const { user, email, pass, type } = req.body;
    const user1 = new userSchema({
        user: user,
        email: email,
        pass: pass,
        type: type
    });
    user1.encryptpass(user1.pass)
        .then((encryptedPass) => {
            user1.pass = encryptedPass;
            return user1.save();
        })
        .then(() => {
            res.json({
                message: "user guardado.",
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                message: "Error al guardar el usuario."
            });
        });
});

//inicio de sesión
/**
 * @swagger
 * paths:
 *   /api/login:
 *     post:
 *       summary: User login
 *       tags: [User]
 *       operationId: loginUser
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                 password:
 *                   type: string
 *                   description: The password of the user
 *       responses:
 *           '200':
 *             description: Successful login
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: null
 *                       description: If there was a error
 *                       
 *                     data: 
 *                       type: string
 *                       description: Bienvenido(a)
 *                 example:
 *                    message: Null
 *                    data: Bienvenido(a)
 *           '400':
 *              description: Invalid password
 *              content:
 *                       application/json:
 *                         schema:
 *                           type: object
 *                           properties:
 *                             error:
 *                               type: string
 *                               description: Error message for invalid password
 *                         example: 
 *                              error: pass no válida 
 *           '500':
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                          message:
 *                              type: string
 *                              description: Error message for internal server error
 *                      example:
 *                          error: Error al iniciar sesión.
 */
router.post("/login", (req, res) => {
    // validaciones
    const { error } = userSchema.validate(req.body.email, req.body.pass);
    if (error) return res.status(400).json({ error: error.details[0].message });
    //Buscando el user por su dirección de email
    userSchema.findOne({ email: req.body.email })
        .then((user) => {
            //validando si no se encuentra
            if (!user) return res.status(400).json({ error: "user no encontrado" });
            //Transformando la contraseña a su valor original para 
            //compararla con la pass que se ingresa en el inicio de sesión
            return bcrypt.compare(req.body.pass, user.pass);
        })
        .then((validPassword) => {
            if (!validPassword)
                return res.status(400).json({ error: "pass no válida" });
            res.json({
                error: null,
                data: "Bienvenido(a)",
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                message: "Error al iniciar sesión."
            });
        });
});



//conseguir todos los ususarios
/**
 * @swagger
 * paths:
 *   /api/user:
 *     get:
 *       summary: Get all users
 *       tags: [User]
 *       operationId: getAllUsers
 *       responses:
 *         '200':
 *           description: Successfully retrieved users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for internal server error
 *                 example:
 *                   message: Error al obtener los usuarios.
 */

router.get("/user", (req, res) => {
    userSchema.find()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                message: "Error al obtener los usuarios."
            });
        });
});

//conseguir un usuario
/**
 * @swagger
 * paths:
 *   /api/user/{id}:
 *     get:
 *       summary: Get a user by ID
 *       tags: [User]
 *       operationId: getUserById
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the user
 *       responses:
 *         '200':
 *           description: Successfully retrieved user by ID
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for internal server error
 *                 example:
 *                   message: Error al obtener el usuario.
 */
router.get("/user/:id", (req, res) => {
    userSchema.findById(req.params.id)
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                message: "Error al obtener el usuario."
            });
        });
});

// Modificar a un usuario por el id
/**
 * @swagger
 * paths:
 *   /api/user/{id}:
 *     put:
 *       summary: Update a user by ID
 *       tags: [User]
 *       operationId: updateUserById
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the user
 *       requestBody:
 *         required: true
 *         content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *       responses:
 *         '200':
 *           description: Successfully updated user
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message for user update
 *                 example: 
 *                   message: user updated
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for user not found
 *                 example:
 *                   message: user not found.
 */

router.put('/user/:id', function updateUser(req, res) {
    const { user, email, pass, type } = req.body;
    userSchema.findById(req.params.id) // find the user by id
        .then((user1) => {
            if (user1) {
                user1.user = user;
                user1.email = email;
                return user1.encryptpass(pass);
            } else {
                throw new Error("user not found.");
            }
        })
        .then((encryptedPass) => {
            user1.pass = encryptedPass;
            user1.type = type;
            return user1.save(); //save the updated user
        })
        .then(() => {
            res.json({
                message: "user updated.",
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(404).json({
                message: error.message,
            });
        });
});

// Eliminar un usuario
/**
 * @swagger
 * paths:
 *   /api/user/{id}:
 *     delete:
 *       summary: Delete a user by ID
 *       tags: [User]
 *       operationId: deleteUserById
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the user to delete
 *       responses:
 *         '200':
 *           description: Successfully deleted user
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message for user deletion
 *                 example: 
 *                   message: user delete
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message 
 *                 example:
 *                   message: Error.
 */
router.delete("/user/:id", async (req, res) => {
    await userSchema.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({
                message: "user delete.",
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error.",
                error: error,
            });
        });
});

// Conseguir usuarios por type
/**
 * @swagger
 * paths:
 *   /api/user/type/{type}:
 *     get:
 *       summary: Get users by type
 *       tags: [User]
 *       operationId: getUsersByType
 *       parameters:
 *         - in: path
 *           name: type
 *           required: true
 *           schema:
 *             type: string
 *           description: The type of users to retrieve
 *       responses:
 *         '200':
 *           description: Successfully retrieved users by type
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message for internal server error
 *                 example:
 *                   message: Error.
 */

router.get("/user/type/:type", async (req, res) => {
    try {
        const user = await userSchema.find({ type: req.params.type });
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error.",
            error: error,
        });
    }
});

module.exports = router;
