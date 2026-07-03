import { Router } from 'express';
import {
    getAllReportes,
    getReporteById,
    createReporte,
    updateReporte,
    deleteReporte,
} from '../controllers/reportes.controller';

const router = Router();

router.get('/', getAllReportes);
router.get('/:id', getReporteById);
router.post('/', createReporte);
router.put('/:id', updateReporte);
router.delete('/:id', deleteReporte);

export default router;
