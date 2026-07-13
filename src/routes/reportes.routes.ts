import { Router } from 'express';
import {
    getAllReportes,
    getReporteById,
    createReporte,
    updateReporte,
    deleteReporte,
} from '../controllers/reportes.controller';
import { validateCreateReporte, validateUpdateReporte } from '../middlewares/validators/reporte.validator';

const router = Router();

router.get('/', getAllReportes);
router.get('/:id', getReporteById);
router.post('/', validateCreateReporte, createReporte);
router.put('/:id', validateUpdateReporte, updateReporte);
router.delete('/:id', deleteReporte);

export default router;
