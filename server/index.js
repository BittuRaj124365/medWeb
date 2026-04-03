import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import fs from 'fs';

import medicineRoutes from './routes/medicineRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false });
app.use('/api/', apiLimiter);

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Database connection + startup checks
const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medweb';
const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log('✅ Created uploads directory');
    }

    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

    // Test email configuration
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS &&
      process.env.EMAIL_USER !== 'your.gmail@gmail.com') {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        tls: { rejectUnauthorized: false }
      });
      transporter.verify()
        .then(() => console.log('✅ Email service connected — OTP emails will be sent.'))
        .catch(err => console.warn('⚠️  Email service NOT ready:', err.message, '\n   → Check EMAIL_USER and EMAIL_PASS in server/.env'));
    } else {
      console.warn('⚠️  EMAIL_USER/EMAIL_PASS not configured — OTPs will be printed to console only.');
      console.warn('   → See server/.env for instructions on how to set up Gmail App Password.');
    }
  })
  .catch((error) => console.log(`MongoDB connection error: ${error}`));
