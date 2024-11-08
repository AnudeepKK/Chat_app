const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path to your User model

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Decode the token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = decoded
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach full user object to req.user
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
