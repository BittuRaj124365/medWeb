import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import medicineRoutes from './routes/medicineRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', adminRoutes); // auth handles /login inside adminRoutes but let's map /api/auth as well or just let the client call /api/admin/login

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medweb';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
