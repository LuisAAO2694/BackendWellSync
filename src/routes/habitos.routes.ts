import { Router } from 'express';
import {
    getAllHabitos,
    getHabitoById,
    createHabito,
    updateHabito,
    deleteHabito,
} from '../controllers/habitos.controller';
import { validateCreateHabito, validateUpdateHabito } from '../middlewares/validators/habito.validator';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getAllHabitos);
router.get('/:id', authenticate, getHabitoById);
router.post('/', authenticate, validateCreateHabito, createHabito);
router.put('/:id', authenticate, validateUpdateHabito, updateHabito);
router.delete('/:id', authenticate, deleteHabito);

export default router;
