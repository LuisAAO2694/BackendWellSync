import { NextFunction, Request, Response } from 'express';
import { entrenamientoService } from '../services/entrenamiento.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador recibir las peticiones HTTP que vienen de los entrenamientos

/**
 * @openapi
 * /api/entrenamientos:
 *   get:
 *     tags: [Entrenamientos]
 *     summary: Obtener todos los entrenamientos
 *     responses:
 *       200:
 *         description: Lista de entrenamientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entrenamiento'
 */
//Obtengo todos los entrenamientos
export async function getAllEntrenamientos(req: Request, res: Response, next: NextFunction) {
    try {
        const entrenamientos = await entrenamientoService.getAll();
        res.json(entrenamientos);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/entrenamientos/{id}:
 *   get:
 *     tags: [Entrenamientos]
 *     summary: Obtener un entrenamiento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del entrenamiento
 *     responses:
 *       200:
 *         description: Entrenamiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrenamiento'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Obtengo un entrenamietno por su id
export async function getEntrenamientoById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const entrenamiento = await entrenamientoService.getById(id);

        if (!entrenamiento) {
            return next(new AppError('Entrenamiento no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(entrenamiento);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/entrenamientos:
 *   post:
 *     tags: [Entrenamientos]
 *     summary: Crear un nuevo entrenamiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEntrenamientoInput'
 *     responses:
 *       200:
 *         description: Entrenamiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrenamiento'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
//Creo un nuevo entrenamiento
export async function createEntrenamiento(req: Request, res: Response, next: NextFunction) {
    try {
        const entrenamiento = await entrenamientoService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(entrenamiento);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/entrenamientos/{id}:
 *   put:
 *     tags: [Entrenamientos]
 *     summary: Actualizar un entrenamiento existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del entrenamiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEntrenamientoInput'
 *     responses:
 *       200:
 *         description: Entrenamiento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrenamiento'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Actualizo un entrenamiento que ya existe
export async function updateEntrenamiento(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const entrenamiento = await entrenamientoService.update(id, req.body);

        if (!entrenamiento) {
            return next(new AppError('Entrenamiento no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(entrenamiento);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/entrenamientos/{id}:
 *   delete:
 *     tags: [Entrenamientos]
 *     summary: Eliminar un entrenamiento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del entrenamiento
 *     responses:
 *       200:
 *         description: Entrenamiento eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Entrenamiento eliminado correctamente
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Elimino un entrenamiento por su id
export async function deleteEntrenamiento(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const entrenamiento = await entrenamientoService.delete(id);

        if (!entrenamiento) {
            return next(new AppError('Entrenamiento no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Entrenamiento eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
