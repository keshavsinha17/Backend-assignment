import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = async (req, res, next) => {
  try {
    // Try to get token from Authorization header first
    let token = null;
    const authHeader = req.header('Authorization');
    if (authHeader) {
      token = authHeader.replace('Bearer ', '');
    }

    // If no header token, try cookie
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token and get user
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Store user ID in req.user for consistency
    req.user = {
      _id: user._id,
      ...user.toObject()
    };

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ 
      message: 'Invalid token', 
      error: error.message 
    });
  }
};
