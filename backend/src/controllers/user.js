// src/controllers/user.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');  // Adjust the path as needed

// Register a new user
const register = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    email=email.toLowerCase();
    // Check if the user already exists
    const user = await userModel.getByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await userModel.create( username, email,  hashedPassword );

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);

    // Respond with the token
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
const login = async (req, res) => {
  let { email, password } = req.body;

  try {
    email=email.toLowerCase();

    // Find the user by email
    const user = await userModel.getByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, role:user.role }, process.env.JWT_SECRET);

    // Respond with the token
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user=req.user;
    // Respond with user details (excluding the password)
    res.status(200).json({ user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const update= async (req, res) => {
  const { username, email, password } = req.body;
  const user_id = req.user.id;  // Extract user ID from the request object (set by auth middleware)

  try {
    // Update user fields
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    // Update the user
    const updatedUser = await userModel.updateUserById(user_id, updatedFields);

    // Respond with the updated user details (excluding the password)
    res.status(200).json({ user: { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email } });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user profile
const remove = async (req, res) => {
  try {
    const user_id = req.user.id;  // Extract user ID from the request object (set by auth middleware)

    // Delete the user
    const result = await userModel.deleteUserById(user_id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with success message
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userModel.getByEmail(email);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  register,
  login,
  getProfile,
  update,
  remove,
  getByEmail
};
