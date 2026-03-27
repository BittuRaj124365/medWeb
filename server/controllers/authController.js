import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });

// ─── Nodemailer transporter (Gmail SMTP, port 587) ──────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS  // Gmail App Password
    },
    tls: { rejectUnauthorized: false }
  });

const sendOTPEmail = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not configured — OTP is:', otp);
    return;
  }
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"MedShop Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'MedShop Admin – Your Login OTP',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
        <div style="background:#0f172a;padding:28px 32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:-0.5px;">MedShop <span style="color:#0d9488;">Admin</span></h1>
        </div>
        <div style="padding:40px 32px;">
          <p style="color:#334155;font-size:16px;margin:0 0 8px 0;">Hello Admin,</p>
          <p style="color:#64748b;font-size:15px;margin:0 0 32px 0;">Use the OTP below to verify your identity. It expires in <strong>5 minutes</strong>.</p>
          <div style="text-align:center;margin:0 0 32px 0;">
            <span style="display:inline-block;font-size:42px;font-weight:900;letter-spacing:10px;color:#0f172a;background:#f8fafc;padding:16px 28px;border-radius:12px;border:2px solid #e2e8f0;">${otp}</span>
          </div>
          <p style="color:#94a3b8;font-size:13px;margin:0;">If you did not request this, please ignore this email and secure your account.</p>
        </div>
        <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} MedShop Inventory System</p>
        </div>
      </div>`
  });
};

// ─── Login ───────────────────────────────────────────────────────────────────
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
    if (!admin.email) {
      return res.json({ requiresSetup: true, username: admin.username, message: 'Please complete account setup.' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    admin.otpAttempts = 0;
    await admin.save();
    await sendOTPEmail(admin.email, otp);
    res.json({ message: 'OTP sent to registered email', username: admin.username, requiresOtp: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ─── First-time email setup ───────────────────────────────────────────────────
export const setupEmail = async (req, res) => {
  const { username, name, email, confirmEmail } = req.body;
  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Please enter a valid email address' });
    if (email !== confirmEmail)
      return res.status(400).json({ message: 'Email addresses do not match' });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.email) return res.status(400).json({ message: 'Email already set. Use Account Settings to update it.' });

    if (name?.trim()) admin.name = name.trim();
    admin.email = email.toLowerCase().trim();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    admin.otpAttempts = 0;
    await admin.save();
    await sendOTPEmail(admin.email, otp);
    res.json({ message: 'Email saved. OTP sent to your inbox.', username: admin.username, requiresOtp: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  const { username, otp } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.lockUntil && admin.lockUntil > Date.now())
      return res.status(403).json({ message: 'Account locked due to too many failed attempts' });
    if (!admin.otp || !admin.otpExpiry)
      return res.status(400).json({ message: 'No OTP found. Please login again.' });
    if (admin.otpExpiry < Date.now())
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    if (admin.otp !== otp) {
      admin.otpAttempts += 1;
      if (admin.otpAttempts >= 3) {
        admin.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
        admin.otp = null; admin.otpExpiry = null;
        await admin.save();
        return res.status(403).json({ message: 'Too many wrong attempts. Locked for 10 minutes.' });
      }
      await admin.save();
      return res.status(400).json({ message: `Incorrect OTP. ${3 - admin.otpAttempts} attempt(s) left.` });
    }
    admin.otp = null; admin.otpExpiry = null; admin.otpAttempts = 0; admin.lockUntil = null;
    await admin.save();
    res.json({ _id: admin._id, username: admin.username, name: admin.name, email: admin.email, profilePicture: admin.profilePicture, token: generateToken(admin._id) });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ─── Resend OTP ───────────────────────────────────────────────────────────────
export const resendOtp = async (req, res) => {
  const { username } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.lockUntil && admin.lockUntil > Date.now())
      return res.status(403).json({ message: 'Account locked. Try again later.' });
    if (!admin.email)
      return res.status(400).json({ message: 'No email registered. Please complete account setup first.' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await admin.save();
    await sendOTPEmail(admin.email, otp);
    res.json({ message: 'New OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email address is required' });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.status(404).json({ message: 'No account found with that email address' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await admin.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/admin/reset-password?token=${resetToken}`;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email not configured — Reset URL is:', resetUrl);
    } else {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"MedShop Admin" <${process.env.EMAIL_USER}>`,
        to: admin.email,
        subject: 'MedShop Admin – Password Reset Request',
        html: `
          <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <div style="background:#0f172a;padding:28px 32px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:22px;">MedShop <span style="color:#0d9488;">Admin</span></h1>
            </div>
            <div style="padding:40px 32px;">
              <p style="color:#334155;font-size:16px;margin:0 0 8px 0;">Hello Admin,</p>
              <p style="color:#64748b;font-size:15px;margin:0 0 24px 0;">We received a request to reset your admin account password. Click the button below to set a new password.</p>
              <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;margin:0 0 28px 0;">
                <p style="color:#92400e;font-size:13px;margin:0;">⏰ This link expires in <strong>15 minutes</strong>. If you did not request this, please ignore this email.</p>
              </div>
              <div style="text-align:center;margin:0 0 32px 0;">
                <a href="${resetUrl}" style="display:inline-block;background:#0d9488;color:#fff;font-weight:700;font-size:15px;padding:16px 36px;border-radius:12px;text-decoration:none;">Reset My Password</a>
              </div>
              <p style="color:#94a3b8;font-size:12px;margin:0;">Or paste this link in your browser:<br/><a href="${resetUrl}" style="color:#0d9488;word-break:break-all;">${resetUrl}</a></p>
            </div>
            <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} MedShop Inventory System</p>
            </div>
          </div>`
      });
    }

    res.json({ message: 'Password reset email sent. Check your inbox.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  try {
    if (!token) return res.status(400).json({ message: 'Reset token is missing' });
    if (!newPassword) return res.status(400).json({ message: 'New password is required' });
    if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!admin) return res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' });

    admin.password = newPassword;
    admin.resetPasswordToken = null;
    admin.resetPasswordExpiry = null;
    await admin.save();

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
