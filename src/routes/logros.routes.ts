import { Router } from 'express';
import { getAllLogros, getLogroById, createLogro, updateLogro, deleteLogro } from '../controllers/logros.controller';
import { validateCreateLogro, validateUpdateLogro } from '../middlewares/validators/logro.validator';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getAllLogros);
router.get('/:id', authenticate, getLogroById);
router.post('/', authenticate, validateCreateLogro, createLogro);
router.put('/:id', authenticate, validateUpdateLogro, updateLogro);
router.delete('/:id', authenticate, deleteLogro);

export default router;
