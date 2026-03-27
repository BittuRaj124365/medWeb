import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, verifyOtp, resendOtp, setupEmail } from '../controllers/authController.js';

const router = express.Router();

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many OTP verification attempts. Please try again later.' }
});

const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many OTP resend attempts. Please try again later.' }
});

const setupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many setup attempts. Please try again later.' }
});

router.post('/login', login);
router.post('/setup-email', setupLimiter, setupEmail);
router.post('/verify-otp', verifyLimiter, verifyOtp);
router.post('/resend-otp', resendLimiter, resendOtp);

export default router;
