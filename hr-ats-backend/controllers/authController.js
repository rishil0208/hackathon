const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- User Sign Up ---
exports.signup = async (req, res) => {
  try {
    const { email, password, role, companyName } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      companyName: role === 'company' ? companyName : undefined,
    });

    // 4. Generate a JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: '90d',
    });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// --- User Login ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists and password is correct
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // 2. Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '90d',
    });

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};