import express from 'express';
import multer from 'multer';
import path from 'path';

import { 
  getDashboardStats,
  updateCredentials,
  updateProfile,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getAdminLogs,
  getReports,
  getFeedbacks,
  updateFeedbackStatus,
  deleteFeedback
} from '../controllers/adminController.js';
import { 
  createMedicine, 
  updateMedicine, 
  deleteMedicine 
} from '../controllers/medicineController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(null, true);
  }
});

// Protected routes
router.get('/dashboard', protectAdmin, getDashboardStats);
router.put('/credentials', protectAdmin, updateCredentials);
router.put('/profile', protectAdmin, upload.single('profilePicture'), updateProfile);
router.post('/medicines', protectAdmin, createMedicine);
router.put('/medicines/:id', protectAdmin, updateMedicine);
router.delete('/medicines/:id', protectAdmin, deleteMedicine);

// Suppliers
router.route('/suppliers')
  .get(protectAdmin, getSuppliers)
  .post(protectAdmin, createSupplier);
router.route('/suppliers/:id')
  .put(protectAdmin, updateSupplier)
  .delete(protectAdmin, deleteSupplier);

// Logs & Reports
router.get('/logs', protectAdmin, getAdminLogs);
router.get('/reports', protectAdmin, getReports);

// Feedbacks
router.route('/feedbacks')
  .get(protectAdmin, getFeedbacks);
router.route('/feedbacks/:id')
  .put(protectAdmin, updateFeedbackStatus)
  .delete(protectAdmin, deleteFeedback);

export default router;
