import { Router } from 'express';
import usuariosRoutes from './usuarios.routes';
import habitosRoutes from './habitos.routes';
import registrosDiariosRoutes from './registrosDiarios.routes';
import entrenamientosRoutes from './entrenamientos.routes';
import logrosRoutes from './logros.routes';
import reportesRoutes from './reportes.routes';
import notificacionesRoutes from './notificaciones.routes';
import ejerciciosRoutes from './ejercicios.routes';
import caloriasRoutes from './calorias.routes';

const router = Router();

router.use('/api/usuarios', usuariosRoutes);
router.use('/api/habitos', habitosRoutes);
router.use('/api/registros-diarios', registrosDiariosRoutes);
router.use('/api/entrenamientos', entrenamientosRoutes);
router.use('/api/logros', logrosRoutes);
router.use('/api/reportes', reportesRoutes);
router.use('/api/notificaciones', notificacionesRoutes);
router.use('/api/ejercicios', ejerciciosRoutes);
router.use('/api/calorias', caloriasRoutes);

export default router;
