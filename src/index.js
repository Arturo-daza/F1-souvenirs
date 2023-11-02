const parser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const authRoutes = require('./routes/authentication');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const reviewRoutes = require('./routes/review');
const orderRoutes = require('./routes/order');
const categoryRoutes = require('./routes/category');
// swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de la tienda',
      version: '1.0.0',
      description:
        'API de la tienda para el proyecto de la asignatura de Ingeniería del Software 2',
      contact: {
        name: 'Arturo daza',
        email: 'arturodaza@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

// Mongo db
const mongoose = require('mongoose');
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

require('dotenv').config();
app.use(parser.urlencoded({ extended: false })); //permite leer los datos que vienen en la petición
app.use(parser.json()); // transforma los datos a formato JSON

//Gestión de las rutas usando el middleware
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', reviewRoutes);
app.use('/api', orderRoutes);
app.use('/api', categoryRoutes);
app.use(
  '/api-doc',
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);
app.use(express.json());

//Conexión a la base de datos
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa'))
  .catch((error) => console.log(error));

//Conexión al puerto
app.listen(port, () => {
  console.log(`🛒 server listening on port ${port}`);
});
