import { Router } from 'express';
import {
    getAllReportes,
    getReporteById,
    createReporte,
    updateReporte,
    deleteReporte,
} from '../controllers/reportes.controller';
import { validateCreateReporte, validateUpdateReporte } from '../middlewares/validators/reporte.validator';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getAllReportes);
router.get('/:id', authenticate, getReporteById);
router.post('/', authenticate, validateCreateReporte, createReporte);
router.put('/:id', authenticate, validateUpdateReporte, updateReporte);
router.delete('/:id', authenticate, deleteReporte);

export default router;
