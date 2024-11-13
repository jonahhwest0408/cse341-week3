require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { signup, login, logout } = require('./controllers/authController');
const authenticate = require('./middleware/authenticate');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// Import routes
const itemsRoutes = require('./routes/itemRoutes'); 

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Use routes
app.use('/api/items', itemsRoutes);

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Sign Up and Login Route
app.post('/signup', signup);
app.post('/login', login);
app.post('/logout', logout);

//Authenticate
app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'You have access to this protected route' });
  });

//Swagger
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0', 
      info: {
        title: 'Node.js API with Authentication',  
        description: 'This API handles user authentication with JWT tokens for secured routes.',
        version: '1.0.0',  
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./routes/*.js', './controllers/*.js'],
  };

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI at the /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
