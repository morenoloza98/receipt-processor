const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Receipt Processor',
    description: 'A simple receipt processor',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/receipts', require('./routes/receipts'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
