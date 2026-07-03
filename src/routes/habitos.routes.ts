import { Router } from 'express';
import {
    getAllHabitos,
    getHabitoById,
    createHabito,
    updateHabito,
    deleteHabito,
} from '../controllers/habitos.controller';

const router = Router();

router.get('/', getAllHabitos);
router.get('/:id', getHabitoById);
router.post('/', createHabito);
router.put('/:id', updateHabito);
router.delete('/:id', deleteHabito);

export default router;
