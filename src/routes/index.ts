import { Router } from 'express';
import usuariosRoutes from './usuarios.routes';
import habitosRoutes from './habitos.routes';
import registrosDiariosRoutes from './registrosDiarios.routes';
import entrenamientosRoutes from './entrenamientos.routes';
import logrosRoutes from './logros.routes';
import reportesRoutes from './reportes.routes';
import notificacionesRoutes from './notificaciones.routes';

const router = Router();

router.use('/api/usuarios', usuariosRoutes);
router.use('/api/habitos', habitosRoutes);
router.use('/api/registros-diarios', registrosDiariosRoutes);
router.use('/api/entrenamientos', entrenamientosRoutes);
router.use('/api/logros', logrosRoutes);
router.use('/api/reportes', reportesRoutes);
router.use('/api/notificaciones', notificacionesRoutes);

export default router;
