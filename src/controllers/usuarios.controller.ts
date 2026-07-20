import { NextFunction, Request, Response } from 'express';
import { usuarioService } from '../services/usuario.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador recibir las peticiones HTTP que vienen de los usuarios

/**
 * @openapi
 * /api/usuarios/login:
 *   post:
 *     tags: [Usuarios]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
//Este es el controlador que procesa la soli de login
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const result = await usuarioService.login(email, password);
        res.json(result);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
//Obtengo todos los usuarios
export async function getAllUsuarios(req: Request, res: Response, next: NextFunction) {
    try {
        const usuarios = await usuarioService.getAll();
        res.json(usuarios);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/usuarios/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener un usuario por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Obtengo un usuario por su ID (admin ve cualquiera, user solo su propio perfil)
export async function getUsuarioById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.getById(id, req.usuario!.id, req.usuario!.rol);

        if (!usuario) {
            return next(new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(usuario);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/usuarios:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUsuarioInput'
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
//Creo un nuevo usuario
export async function createUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const usuario = await usuarioService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(usuario);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/usuarios/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar un usuario existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUsuarioInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Actualizo un usuario existente (admin actualiza cualquiera, user solo su propio perfil)
export async function updateUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.update(id, req.body, req.usuario!.id, req.usuario!.rol);

        if (!usuario) {
            return next(new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND));
        }
        res.json(usuario);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/usuarios/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado correctamente
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Aqui pues solo lo elimino
export async function deleteUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.delete(id);

        if (!usuario) {
            return next(new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/usuarios/forgot-password:
 *   post:
 *     tags: [Usuarios]
 *     summary: Solicitar recuperación de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Mensaje genérico de recuperación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
//Mi controlador que procesa la solicitud de recuperar contraseña
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body;
        const result = await usuarioService.forgotPassword(email);
        res.json(result);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/usuarios/reset-password:
 *   post:
 *     tags: [Usuarios]
 *     summary: Restablecer contraseña con token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
//Controlador solo para procesar la solicitud del restablecimiento de la contraseña
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, password } = req.body;
        const result = await usuarioService.resetPassword(token, password);
        res.json(result);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/usuarios/google:
 *   post:
 *     tags: [Usuarios]
 *     summary: Iniciar sesión o registrarse con Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
//Controlador solo para procesar la solicitud de inicio de sesion con google
export async function googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const { idToken } = req.body;
        const result = await usuarioService.googleLogin(idToken);
        res.json(result);
    } catch (e) {
        next(e);
    }
}
