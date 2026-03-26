import express from 'express';
import { 
  authAdmin, 
  getDashboardStats,
  updateCredentials,
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

// Auth route
router.post('/login', authAdmin);

// Protected routes
router.get('/dashboard', protectAdmin, getDashboardStats);
router.put('/credentials', protectAdmin, updateCredentials);
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
