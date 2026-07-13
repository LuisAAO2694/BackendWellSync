import { Router } from 'express';
import {
    getAllHabitos,
    getHabitoById,
    createHabito,
    updateHabito,
    deleteHabito,
} from '../controllers/habitos.controller';
import { validateCreateHabito, validateUpdateHabito } from '../middlewares/validators/habito.validator';

const router = Router();

router.get('/', getAllHabitos);
router.get('/:id', getHabitoById);
router.post('/', validateCreateHabito, createHabito);
router.put('/:id', validateUpdateHabito, updateHabito);
router.delete('/:id', deleteHabito);

export default router;
