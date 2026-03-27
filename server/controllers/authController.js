import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const sendOTPEmail = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials not configured! OTP is:", otp);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your MedShop Admin Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">MedShop Admin</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #334155;">Hello Admin,</p>
          <p style="font-size: 16px; color: #334155;">A login attempt was made to your account. Please use the following One-Time Password to verify your identity:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #0f172a; background-color: #f8fafc; padding: 10px 20px; border-radius: 8px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #64748b;">This OTP expires in exactly <strong>5 minutes</strong>.</p>
          <p style="font-size: 14px; color: #64748b;">If you did not request this login, please ignore this email and secure your account.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} MedShop Inventory System</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    // First-time setup: no email registered yet
    if (!admin.email) {
      return res.json({
        requiresSetup: true,
        username: admin.username,
        message: 'No email registered. Please complete account setup.'
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    admin.otpAttempts = 0;
    await admin.save();

    await sendOTPEmail(admin.email, otp);

    res.json({ message: 'OTP sent to registered email', username: admin.username, requiresOtp: true });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc  First-time email setup — called after password is verified but before OTP
// @route POST /api/auth/setup-email
// @access Public (username proves identity after successful password step)
export const setupEmail = async (req, res) => {
  const { username, name, email, confirmEmail } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    // Accept any valid email, not just Gmail (admin may use work email)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (email !== confirmEmail) {
      return res.status(400).json({ message: 'Email addresses do not match' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (admin.email) {
      return res.status(400).json({
        message: 'Email is already configured. Use Account Settings to update it.'
      });
    }

    if (name && name.trim()) admin.name = name.trim();
    admin.email = email.toLowerCase().trim();

    // Generate OTP and send immediately
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    admin.otpAttempts = 0;
    await admin.save();

    await sendOTPEmail(admin.email, otp);

    res.json({
      message: 'Email saved successfully. OTP sent to your email.',
      username: admin.username,
      requiresOtp: true
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { username, otp } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Account locked due to too many failed attempts' });
    }

    if (!admin.otp || !admin.otpExpiry) {
      return res.status(400).json({ message: 'No OTP request found. Please login again.' });
    }

    if (admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (admin.otp !== otp) {
      admin.otpAttempts += 1;
      if (admin.otpAttempts >= 3) {
        admin.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
        admin.otp = null;
        admin.otpExpiry = null;
        await admin.save();
        return res.status(403).json({ message: 'Too many incorrect attempts. Account locked for 10 minutes.' });
      }
      await admin.save();
      return res.status(400).json({ message: `Incorrect OTP. ${3 - admin.otpAttempts} attempt(s) remaining.` });
    }

    // Success
    admin.otp = null;
    admin.otpExpiry = null;
    admin.otpAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    res.json({
      _id: admin._id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      profilePicture: admin.profilePicture,
      token: generateToken(admin._id),
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const resendOtp = async (req, res) => {
  const { username } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    if (!admin.email) {
      return res.status(400).json({ message: 'No email registered. Please complete account setup first.' });
    }

    // Cooldown check
    if (admin.otpExpiry) {
      const timeSinceLastOtp = (5 * 60 * 1000) - (admin.otpExpiry - Date.now());
      if (timeSinceLastOtp < 30 * 1000) {
        return res.status(429).json({ message: 'Please wait 30 seconds before resending OTP' });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await admin.save();

    await sendOTPEmail(admin.email, otp);
    res.json({ message: 'A new OTP has been sent to your email' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
