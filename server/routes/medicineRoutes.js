import express from 'express';
import { getMedicines, getMedicineById, searchMedicines, addFeedback, getMedicineFeedbacks, getShopRatingStats } from '../controllers/medicineController.js';

const router = express.Router();

router.get('/search', searchMedicines);
router.get('/shop-ratings', getShopRatingStats); // Must be before /:id
router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.get('/:id/feedbacks', getMedicineFeedbacks);
router.post('/:id/feedbacks', addFeedback);

export default router;
