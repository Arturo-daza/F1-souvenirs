const parser = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;
const authRoutes = require("./routes/authentication")
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const ReviewRoutes = require('./routes/review');
const mongoose = require("mongoose");


require("dotenv").config();
app.use(parser.urlencoded({ extended: false })); //permite leer los datos que vienen en la petición
app.use(parser.json()); // transforma los datos a formato JSON


//Gestión de las rutas usando el middleware
app.use("/api", authRoutes)
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", ReviewRoutes);
app.use(express.json());


//Conexión a la base de datos
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log(error));


//Conexión al puerto
app.listen(port, () => {
    console.log(port)
});
