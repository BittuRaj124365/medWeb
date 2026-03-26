import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, verifyOtp, resendOtp } from '../controllers/authController.js';

const router = express.Router();

// Rate limiting for OTP verification and resend to prevent brute force
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 verify requests per windowMs
  message: { message: 'Too many OTP verification attempts. Please try again later.' }
});

const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { message: 'Too many OTP resend attempts. Please try again later.' }
});

router.post('/login', login);
router.post('/verify-otp', verifyLimiter, verifyOtp);
router.post('/resend-otp', resendLimiter, resendOtp);

export default router;
