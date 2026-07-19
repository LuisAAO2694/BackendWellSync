import { Router } from 'express';
import {
    getAllNotificaciones,
    marcarNotificacionLeida,
    marcarTodasNotificacionesLeidas,
} from '../controllers/notificaciones.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getAllNotificaciones);
router.patch('/leer-todas', authenticate, marcarTodasNotificacionesLeidas);
router.patch('/:id/leer', authenticate, marcarNotificacionLeida);

export default router;
