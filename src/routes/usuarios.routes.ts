import { Router } from 'express';
import {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
} from '../controllers/usuarios.controller';
import { validateCreateUsuario, validateUpdateUsuario } from '../middlewares/validators/usuario.validator';

const router = Router();

router.get('/', getAllUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', validateCreateUsuario, createUsuario);
router.put('/:id', validateUpdateUsuario, updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
