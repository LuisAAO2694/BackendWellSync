import { Router } from 'express';
import userRoutes from './user.routes';
// Futuro: import habitRoutes from './habit.routes';
// Futuro: import routineRoutes from './routine.routes';
// Futuro: import exerciseRoutes from './exercise.routes';
// Futuro: import energyLogRoutes from './energyLog.routes';
// Futuro: import achievementRoutes from './achievement.routes';
// Futuro: import reportRoutes from './report.routes';

const router = Router();

router.use('/users', userRoutes);
// router.use('/habits', habitRoutes);
// router.use('/routines', routineRoutes);
// router.use('/exercises', exerciseRoutes);
// router.use('/energy-logs', energyLogRoutes);
// router.use('/achievements', achievementRoutes);
// router.use('/reports', reportRoutes);

export default router;
