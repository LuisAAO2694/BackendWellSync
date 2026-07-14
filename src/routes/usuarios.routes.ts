import { Router } from 'express';
import {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    login,
} from '../controllers/usuarios.controller';
import { validateCreateUsuario, validateUpdateUsuario } from '../middlewares/validators/usuario.validator';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.get('/', authenticate, getAllUsuarios);
router.get('/:id', authenticate, getUsuarioById);
router.post('/', validateCreateUsuario, createUsuario);
router.put('/:id', authenticate, validateUpdateUsuario, updateUsuario);
router.delete('/:id', authenticate, deleteUsuario);

export default router;
