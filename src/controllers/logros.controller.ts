import { NextFunction, Request, Response } from 'express';
import { logroService } from '../services/logro.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador para recibir las peticiones HTTP que vienen de los logros

/**
 * @openapi
 * /api/logros:
 *   get:
 *     tags: [Logros]
 *     summary: Obtener todos los logros
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de logros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Logro'
 */
//Obtengo todos los logros del usuario autenticado
export async function getAllLogros(req: Request, res: Response, next: NextFunction) {
    try {
        const logros = await logroService.getAll(req.usuario!.id);
        res.json(logros);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/logros/{id}:
 *   get:
 *     tags: [Logros]
 *     summary: Obtener un logro por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del logro
 *     responses:
 *       200:
 *         description: Logro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Logro'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Obtengo un logro por su id (solo si pertenece al usuario autenticado)
export async function getLogroById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const logro = await logroService.getById(id, req.usuario!.id);

        if (!logro) {
            return next(new AppError('Logro no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(logro);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/logros:
 *   post:
 *     tags: [Logros]
 *     summary: Crear un nuevo logro
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLogroInput'
 *     responses:
 *       200:
 *         description: Logro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Logro'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
//Creo un nuevo logro (asignando automaticamente el usuario del token)
export async function createLogro(req: Request, res: Response, next: NextFunction) {
    try {
        const logro = await logroService.create(req.body, req.usuario!.id);
        res.status(HttpStatus.SUCCESS).json(logro);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/logros/{id}:
 *   put:
 *     tags: [Logros]
 *     summary: Actualizar un logro existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del logro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLogroInput'
 *     responses:
 *       200:
 *         description: Logro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Logro'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Actualizo un logro (solo si pertenece al usuario autenticado)
export async function updateLogro(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const logro = await logroService.update(id, req.body, req.usuario!.id);

        if (!logro) {
            return next(new AppError('Logro no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(logro);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/logros/{id}:
 *   delete:
 *     tags: [Logros]
 *     summary: Eliminar un logro
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del logro
 *     responses:
 *       200:
 *         description: Logro eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logro eliminado correctamente
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Elimino un logro por su id (solo si pertenece al usuario autenticado)
export async function deleteLogro(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const logro = await logroService.delete(id, req.usuario!.id);

        if (!logro) {
            return next(new AppError('Logro no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Logro eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
