import express from 'express';
import { 
  authAdmin, 
  getDashboardStats,
  updateCredentials
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

export default router;
