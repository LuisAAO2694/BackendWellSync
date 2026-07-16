import { NextFunction, Request, Response } from 'express';
import { registroDiarioService } from '../services/registroDiario.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador para recibir las peticiones HTTP que vienen de los registros diarios

/**
 * @openapi
 * /api/registros-diarios:
 *   get:
 *     tags: [Registros Diarios]
 *     summary: Obtener todos los registros diarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros diarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RegistroDiario'
 */
//Obtengo todos los registros diarios del usuario autenticado
export async function getAllRegistrosDiarios(req: Request, res: Response, next: NextFunction) {
    try {
        const registros = await registroDiarioService.getAll(req.usuario!.id);
        res.json(registros);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/registros-diarios/{id}:
 *   get:
 *     tags: [Registros Diarios]
 *     summary: Obtener un registro diario por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro diario
 *     responses:
 *       200:
 *         description: Registro diario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroDiario'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Obtengo un registro diario por su id (solo si pertenece al usuario autenticado)
export async function getRegistroDiarioById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.getById(id, req.usuario!.id);

        if (!registro) {
            return next(new AppError('Registro diario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(registro);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/registros-diarios:
 *   post:
 *     tags: [Registros Diarios]
 *     summary: Crear un nuevo registro diario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRegistroDiarioInput'
 *     responses:
 *       200:
 *         description: Registro diario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroDiario'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
//Creo un nuevo registro diario (asignando automaticamente el usuario del token)
export async function createRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const registro = await registroDiarioService.create(req.body, req.usuario!.id);
        res.status(HttpStatus.SUCCESS).json(registro);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/registros-diarios/{id}:
 *   put:
 *     tags: [Registros Diarios]
 *     summary: Actualizar un registro diario existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro diario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRegistroDiarioInput'
 *     responses:
 *       200:
 *         description: Registro diario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistroDiario'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Actualizo un registro diario (solo si pertenece al usuario autenticado)
export async function updateRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.update(id, req.body, req.usuario!.id);

        if (!registro) {
            return next(new AppError('Registro diario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(registro);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/registros-diarios/{id}:
 *   delete:
 *     tags: [Registros Diarios]
 *     summary: Eliminar un registro diario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del registro diario
 *     responses:
 *       200:
 *         description: Registro diario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registro diario eliminado correctamente
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Elimino un registro diario por su id (solo si pertenece al usuario autenticado)
export async function deleteRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.delete(id, req.usuario!.id);

        if (!registro) {
            return next(new AppError('Registro diario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Registro diario eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
