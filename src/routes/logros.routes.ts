import { Router } from 'express';
import { getAllLogros, getLogroById, createLogro, updateLogro, deleteLogro } from '../controllers/logros.controller';
import { validateCreateLogro, validateUpdateLogro } from '../middlewares/validators/logro.validator';

const router = Router();

router.get('/', getAllLogros);
router.get('/:id', getLogroById);
router.post('/', validateCreateLogro, createLogro);
router.put('/:id', validateUpdateLogro, updateLogro);
router.delete('/:id', deleteLogro);

export default router;
