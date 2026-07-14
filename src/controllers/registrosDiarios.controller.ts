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
//Obtengo todos los registros diarios
export async function getAllRegistrosDiarios(req: Request, res: Response, next: NextFunction) {
    try {
        const registros = await registroDiarioService.getAll();
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
//Obtengo un registro diario por su id
export async function getRegistroDiarioById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.getById(id);

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
//Creo un nuevo registro diario
export async function createRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const registro = await registroDiarioService.create(req.body);
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
//Actualizo un registro diario que ya existe
export async function updateRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.update(id, req.body);

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
//Elimino un registro diario por su id
export async function deleteRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.delete(id);

        if (!registro) {
            return next(new AppError('Registro diario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Registro diario eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
