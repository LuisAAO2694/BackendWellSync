import { Router } from 'express';
import {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    login,
    forgotPassword,
    resetPassword,
    googleLogin,
} from '../controllers/usuarios.controller';
import {
    validateCreateUsuario,
    validateUpdateUsuario,
    validateForgotPassword,
    validateResetPassword,
    validateGoogleLogin,
} from '../middlewares/validators/usuario.validator';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/google', validateGoogleLogin, googleLogin);
router.get('/', authenticate, authorize('administrador'), getAllUsuarios);
router.get('/:id', authenticate, getUsuarioById);
router.post('/', validateCreateUsuario, createUsuario);
router.put('/:id', authenticate, validateUpdateUsuario, updateUsuario);
router.delete('/:id', authenticate, authorize('administrador'), deleteUsuario);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;
