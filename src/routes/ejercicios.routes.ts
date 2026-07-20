import { Router } from 'express';
import { buscarEjercicios, listarEjercicios, getEjercicioPorId } from '../controllers/ejercicios.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/buscar', authenticate, buscarEjercicios);
router.get('/', authenticate, listarEjercicios);
router.get('/:id', authenticate, getEjercicioPorId);

export default router;
