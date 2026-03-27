import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, verifyOtp, resendOtp, setupEmail, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many OTP attempts. Try again later.' } });
const resendLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { message: 'Too many resend attempts. Try again later.' } });
const setupLimiter  = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { message: 'Too many setup attempts. Try again later.' } });
const resetLimiter  = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { message: 'Too many reset attempts. Try again later.' } });

router.post('/login',           login);
router.post('/setup-email',     setupLimiter,  setupEmail);
router.post('/verify-otp',      verifyLimiter, verifyOtp);
router.post('/resend-otp',      resendLimiter, resendOtp);
router.post('/forgot-password', resetLimiter,  forgotPassword);
router.post('/reset-password',  resetLimiter,  resetPassword);

export default router;
