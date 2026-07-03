import { Router } from 'express';
import {
    getAllRegistrosDiarios,
    getRegistroDiarioById,
    createRegistroDiario,
    updateRegistroDiario,
    deleteRegistroDiario,
} from '../controllers/registrosDiarios.controller';

const router = Router();

router.get('/', getAllRegistrosDiarios);
router.get('/:id', getRegistroDiarioById);
router.post('/', createRegistroDiario);
router.put('/:id', updateRegistroDiario);
router.delete('/:id', deleteRegistroDiario);

export default router;
