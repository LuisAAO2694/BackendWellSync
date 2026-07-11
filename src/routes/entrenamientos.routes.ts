import { Router } from 'express';
import {
    getAllEntrenamientos,
    getEntrenamientoById,
    createEntrenamiento,
    updateEntrenamiento,
    deleteEntrenamiento,
} from '../controllers/entrenamientos.controller';
import { validateCreateEntrenamiento, validateUpdateEntrenamiento } from '../middlewares/validators/entrenamiento.validator';

const router = Router();

router.get('/', getAllEntrenamientos);
router.get('/:id', getEntrenamientoById);
router.post('/', validateCreateEntrenamiento, createEntrenamiento);
router.put('/:id', validateUpdateEntrenamiento, updateEntrenamiento);
router.delete('/:id', deleteEntrenamiento);

export default router;
