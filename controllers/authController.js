// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Route to register a new user
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Route to login a user
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 *     security:
 *       - BearerAuth: [] 
 */
const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
  };

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user's information (e.g., email or password)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's unique ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       400:
 *         description: Invalid input or user not found
 *       500:
 *         description: Server error
 */
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      if (email) user.email = email;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
  
      await user.save();
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  /**
   * @swagger
   * /user/{id}:
   *   delete:
   *     summary: Delete a user's account
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The user's unique ID
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       400:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      await user.remove();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = { signup, login, logout, updateUser, deleteUser };
