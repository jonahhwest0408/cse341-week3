require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { signup, login, logout } = require('./controllers/authController');
const authenticate = require('./middleware/authenticate');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

// Import routes
const itemsRoutes = require('./routes/itemRoutes'); 

// Import Google OAuth setup
require('./controllers/auth'); // Include passport setup

const app = express();

app.use(cors()); // CORS should be set before body parsing and routes

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Express session middleware (must be before passport.initialize())
app.use(session({
    secret: 'your-session-secret',  // Use a secret key for the session
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: false }  // For development, set to `false`. For production, use `secure: true` with HTTPS
}));

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Authenticate
app.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'You have access to this protected route' });
});

// Google OAuth routes
app.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
  
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication
      res.redirect('/api-docs');  // Or redirect to a user dashboard, for example
    }
);

// Swagger setup
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
      paths: {
        '/auth/google': {
          get: {
            summary: 'Authenticate with Google OAuth',
            description: 'Initiates Google OAuth authentication to log in a user.',
            responses: {
              200: {
                description: 'Redirect to Google login page',
              },
              400: {
                description: 'Bad request, unable to initiate OAuth',
              },
            },
          },
        },
        '/auth/google/callback': {
          get: {
            summary: 'Google OAuth callback',
            description: 'Handles the callback from Google OAuth after successful login.',
            responses: {
              200: {
                description: 'Login successful, redirecting to API Docs or user dashboard',
              },
              400: {
                description: 'Login failed, invalid credentials',
              },
            },
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
