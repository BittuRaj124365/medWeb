import express from 'express';
import { getMedicines, getMedicineById, searchMedicines, addFeedback, getMedicineFeedbacks } from '../controllers/medicineController.js';

const router = express.Router();

router.get('/search', searchMedicines);
router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.get('/:id/feedbacks', getMedicineFeedbacks);
router.post('/:id/feedback', addFeedback);

export default router;
