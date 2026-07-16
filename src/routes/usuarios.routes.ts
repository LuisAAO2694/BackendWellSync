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
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.get('/', authenticate, authorize('administrador'), getAllUsuarios);
router.get('/:id', authenticate, getUsuarioById);
router.post('/', validateCreateUsuario, createUsuario);
router.put('/:id', authenticate, validateUpdateUsuario, updateUsuario);
router.delete('/:id', authenticate, authorize('administrador'), deleteUsuario);

export default router;
