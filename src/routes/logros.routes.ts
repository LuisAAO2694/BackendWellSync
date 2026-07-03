import { Router } from 'express';
import { getAllLogros, getLogroById, createLogro, updateLogro, deleteLogro } from '../controllers/logros.controller';

const router = Router();

router.get('/', getAllLogros);
router.get('/:id', getLogroById);
router.post('/', createLogro);
router.put('/:id', updateLogro);
router.delete('/:id', deleteLogro);

export default router;
