import { Router } from 'express';
import {
    getAllRegistrosDiarios,
    getRegistroDiarioById,
    createRegistroDiario,
    updateRegistroDiario,
    deleteRegistroDiario,
} from '../controllers/registrosDiarios.controller';
import { validateCreateRegistroDiario, validateUpdateRegistroDiario } from '../middlewares/validators/registroDiario.validator';

const router = Router();

router.get('/', getAllRegistrosDiarios);
router.get('/:id', getRegistroDiarioById);
router.post('/', validateCreateRegistroDiario, createRegistroDiario);
router.put('/:id', validateUpdateRegistroDiario, updateRegistroDiario);
router.delete('/:id', deleteRegistroDiario);

export default router;
