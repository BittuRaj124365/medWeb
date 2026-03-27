import express from 'express';
import { 
  getMedicines, 
  getMedicineById, 
  searchMedicines, 
  addFeedback, 
  getMedicineFeedbacks, 
  getShopRatingStats,
  getApprovedFeedbacks
} from '../controllers/medicineController.js';
import { submitReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/search', searchMedicines);
router.get('/shop-ratings', getShopRatingStats);
router.get('/feedbacks/approved', getApprovedFeedbacks);
router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.get('/:id/feedbacks', getMedicineFeedbacks);
router.post('/:id/feedbacks', addFeedback);
router.post('/:id/report', submitReport);

export default router;
