import { Router } from 'express';
import { calcularCalorias } from '../controllers/calorias.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/calcular', authenticate, calcularCalorias);

export default router;
