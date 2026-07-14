import { NextFunction, Request, Response } from 'express';
import { habitoService } from '../services/habito.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador recibir las peticiones HTTP que vienen de los habitos

/**
 * @openapi
 * /api/habitos:
 *   get:
 *     tags: [Hábitos]
 *     summary: Obtener todos los hábitos
 *     responses:
 *       200:
 *         description: Lista de hábitos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habito'
 */
//Obtengo los habitos
export async function getAllHabitos(req: Request, res: Response, next: NextFunction) {
    try {
        const habitos = await habitoService.getAll();
        res.json(habitos);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/habitos/{id}:
 *   get:
 *     tags: [Hábitos]
 *     summary: Obtener un hábito por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hábito
 *     responses:
 *       200:
 *         description: Hábito encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habito'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Obtengo un habito por el id
export async function getHabitoById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const habito = await habitoService.getById(id);
        if (!habito) {
            return next(new AppError('Habito no encontrado', HttpStatus.NOT_FOUND));
        }
        res.json(habito);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/habitos:
 *   post:
 *     tags: [Hábitos]
 *     summary: Crear un nuevo hábito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHabitoInput'
 *     responses:
 *       200:
 *         description: Hábito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habito'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
//Creo un nuevo habito
export async function createHabito(req: Request, res: Response, next: NextFunction) {
    try {
        const habito = await habitoService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(habito);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/habitos/{id}:
 *   put:
 *     tags: [Hábitos]
 *     summary: Actualizar un hábito existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hábito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateHabitoInput'
 *     responses:
 *       200:
 *         description: Hábito actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habito'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Actualizo un habito que ya existe
export async function updateHabito(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const habito = await habitoService.update(id, req.body);

        if (!habito) {
            return next(new AppError('Habito no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(habito);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/habitos/{id}:
 *   delete:
 *     tags: [Hábitos]
 *     summary: Eliminar un hábito
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hábito
 *     responses:
 *       200:
 *         description: Hábito eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hábito eliminado correctamente
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Elimino el habito por el id
export async function deleteHabito(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const habito = await habitoService.delete(id);

        if (!habito) {
            return next(new AppError('Hábito no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Hábito eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
