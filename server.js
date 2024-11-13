// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import routes
const itemsRoutes = require('./routes/itemRoutes'); // Replace with actual path to your routes file

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI; // The MongoDB URI will be taken from the .env file
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Use routes
app.use('/api/items', itemsRoutes); // Use the routes for CRUD operations on the "items" collection

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
