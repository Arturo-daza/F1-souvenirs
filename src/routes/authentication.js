const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router(); //manejador de rutas de express
const userSchema = require("../models/user");
router.post("/signup", async (req, res) => {
    const { user, email, pass } = req.body;
    const user1 = new userSchema({
        user: user,
        email: email,
        pass: pass,
    });
    user1.pass = await user.encryptpass(user.pass);
    await user1.save(); //save es un método de mongoose para guardar datos en MongoDB
    res.json({
        message: "user guardado.",
    });
});

//inicio de sesión
router.post("/login", async (req, res) => {
      // validaciones
      const { error } = userSchema.validate(req.body.email, req.body.pass);
      if (error) return res.status(400).json({ error: error.details[0].message });
      //Buscando el user por su dirección de email
      const user = await userSchema.findOne({ email: req.body.email });
      //validando si no se encuentra
      if (!user) return res.status(400).json({ error: "user no encontrado" });
      //Transformando la contraseña a su valor original para 
      //compararla con la pass que se ingresa en el inicio de sesión
      const validPassword = await bcrypt.compare(req.body.pass, user.pass);
      if (!validPassword)
        return res.status(400).json({ error: "pass no válida" });
      res.json({
        error: null,
        data: "Bienvenido(a)",
      });
    });
module.exports = router;
