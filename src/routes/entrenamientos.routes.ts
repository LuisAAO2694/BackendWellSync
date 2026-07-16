import { Router } from 'express';
import {
    getAllEntrenamientos,
    getEntrenamientoById,
    createEntrenamiento,
    updateEntrenamiento,
    deleteEntrenamiento,
} from '../controllers/entrenamientos.controller';
import {
    validateCreateEntrenamiento,
    validateUpdateEntrenamiento,
} from '../middlewares/validators/entrenamiento.validator';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getAllEntrenamientos);
router.get('/:id', authenticate, getEntrenamientoById);
router.post('/', authenticate, validateCreateEntrenamiento, createEntrenamiento);
router.put('/:id', authenticate, validateUpdateEntrenamiento, updateEntrenamiento);
router.delete('/:id', authenticate, deleteEntrenamiento);

export default router;
