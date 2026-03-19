import express from 'express';
import { getMedicines, getMedicineById, searchMedicines } from '../controllers/medicineController.js';

const router = express.Router();

router.get('/search', searchMedicines);
router.get('/', getMedicines);
router.get('/:id', getMedicineById);

export default router;
