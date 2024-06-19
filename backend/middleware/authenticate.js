const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const authenticate = async (req, res, next) => {
    const authHeader = req.header('Authorization');
  
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    const token = authHeader.replace('Bearer ', '');
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      req.user = user; // Add user to request
      next();
    } catch (error) {
      console.error('Token validation error:', error); // Log the error for debugging
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
  
  module.exports = authenticate;