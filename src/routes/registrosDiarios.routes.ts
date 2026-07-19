import { Router } from 'express';
import {
    getAllRegistrosDiarios,
    getRegistroDiarioById,
    createRegistroDiario,
    updateRegistroDiario,
    deleteRegistroDiario,
} from '../controllers/registrosDiarios.controller';
import {
    validateCreateRegistroDiario,
    validateUpdateRegistroDiario,
} from '../middlewares/validators/registroDiario.validator';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getAllRegistrosDiarios);
router.get('/:id', authenticate, getRegistroDiarioById);
router.post('/', authenticate, validateCreateRegistroDiario, createRegistroDiario);
router.put('/:id', authenticate, validateUpdateRegistroDiario, updateRegistroDiario);
router.delete('/:id', authenticate, deleteRegistroDiario);

export default router;
