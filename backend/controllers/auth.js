const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const JWT_SECRET = process.env.JWT_SECRET; 


exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.send('All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('User already exists');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, 
      isOnline: true
    });

    await newUser.save();

    res.send({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
        _id: newUser._id
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.send('Server error during registration');
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send('Invalid credentials');
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('Invalid credentials');
    }

   
    const token = jwt.sign(//sign used to create a new JWT
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    user.isOnline = true;
    await user.save();

    res.send({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        _id: user._id
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.send('Server error during login');
  }
};
