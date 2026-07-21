import { NextFunction, Request, Response } from 'express';
import { ejercicioService } from '../services/ejercicios.service';

/**
 * @openapi
 * /api/ejercicios/buscar:
 *   get:
 *     tags: [Ejercicios]
 *     summary: Buscar ejercicios por nombre (fuzzy search)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (ej. "chest press")
 *     responses:
 *       200:
 *         description: Lista de ejercicios encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EjercicioResumen'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
//Mi controlador que solo busca ejercicios, si hay texto
export async function buscarEjercicios(req: Request, res: Response, next: NextFunction) {
    try {
        //Obtengo el paramtro de de busq enviado en la url
        const { q } = req.query;

        //Checo que exista
        if (!q || typeof q !== 'string') {
            res.status(400).json({ errors: ['El parámetro "q" es obligatorio'] });
            return;
        }

        //Llamo al servicio
        const ejercicios = await ejercicioService.buscar(q);
        res.json(ejercicios);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/ejercicios:
 *   get:
 *     tags: [Ejercicios]
 *     summary: Listar ejercicios con filtros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: bodyParts
 *         schema:
 *           type: string
 *         description: Filtrar por parte del cuerpo (ej. "Chest,Shoulders")
 *       - in: query
 *         name: equipments
 *         schema:
 *           type: string
 *         description: Filtrar por equipo (ej. "Barbell,Dumbbell")
 *       - in: query
 *         name: targetMuscles
 *         schema:
 *           type: string
 *         description: Filtrar por músculo objetivo
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Máximo de resultados (default 10, max 25)
 *     responses:
 *       200:
 *         description: Lista paginada de ejercicios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     hasNextPage:
 *                       type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EjercicioResumen'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
//Este otro controlador obtiene una lista de ejercicios aplicando los filtros
export async function listarEjercicios(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, bodyParts, equipments, targetMuscles, limit } = req.query as Record<string, string | undefined>;

        //Este es mi objeto donde alamacenare solo los filtros enviados
        const filtros: Record<string, string> = {};
        if (name) filtros.name = name;
        if (bodyParts) filtros.bodyParts = bodyParts;
        if (equipments) filtros.equipments = equipments;
        if (targetMuscles) filtros.targetMuscles = targetMuscles;
        if (limit) filtros.limit = limit;

        const result = await ejercicioService.listar(filtros);
        res.json(result);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/ejercicios/{id}:
 *   get:
 *     tags: [Ejercicios]
 *     summary: Obtener detalle completo de un ejercicio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ejercicio (ej. "exr_41n2hxnFMotsXTj3")
 *     responses:
 *       200:
 *         description: Detalle del ejercicio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EjercicioDetalle'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Y btw este otro controlador es el que obtiene la info de un ejercico mediante su ID
export async function getEjercicioPorId(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const ejercicio = await ejercicioService.getPorId(id);
        res.json(ejercicio);
    } catch (e) {
        next(e);
    }
}
