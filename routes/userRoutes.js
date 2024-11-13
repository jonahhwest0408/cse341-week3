
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send('Error creating user');
  }
});

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
  
//     if (!user) return res.status(400).send('Invalid credentials');
    
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) return res.status(400).send('Invalid credentials');
  
//     const token = jwt.sign({ _id: user._id }, 'your_jwt_secret');
//     res.json({ token });
//   });