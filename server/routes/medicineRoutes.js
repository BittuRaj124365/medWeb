import express from 'express';
import {
  getMedicineFeedbacks,
  getShopRatingStats,
  getApprovedFeedbacks,
  likeMedicine,
  unlikeMedicine,
  getMedicines,
  getMedicineById,
  searchMedicines,
  addFeedback,
  addReport
} from '../controllers/medicineController.js';

const router = express.Router();

router.get('/search', searchMedicines);
router.get('/shop-ratings', getShopRatingStats);
router.get('/feedbacks/approved', getApprovedFeedbacks);
router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.get('/:id/feedbacks', getMedicineFeedbacks);
router.post('/:id/feedbacks', addFeedback);
router.post('/:id/report', addReport);
router.post('/:id/like', likeMedicine);
router.post('/:id/unlike', unlikeMedicine);

export default router;
