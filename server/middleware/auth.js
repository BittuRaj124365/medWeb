import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
