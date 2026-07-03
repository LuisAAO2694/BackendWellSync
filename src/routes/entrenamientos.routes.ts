import { Router } from 'express';
import {
    getAllEntrenamientos,
    getEntrenamientoById,
    createEntrenamiento,
    updateEntrenamiento,
    deleteEntrenamiento,
} from '../controllers/entrenamientos.controller';

const router = Router();

router.get('/', getAllEntrenamientos);
router.get('/:id', getEntrenamientoById);
router.post('/', createEntrenamiento);
router.put('/:id', updateEntrenamiento);
router.delete('/:id', deleteEntrenamiento);

export default router;
