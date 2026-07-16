import { NextFunction, Request, Response } from 'express';
import { reporteService } from '../services/reporte.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador para recibir las peticiones HTTP que vienen de los reportes

/**
 * @openapi
 * /api/reportes:
 *   get:
 *     tags: [Reportes]
 *     summary: Obtener todos los reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reporte'
 */
//Admin ve todos los reportes, usuario solo los suyos
export async function getAllReportes(req: Request, res: Response, next: NextFunction) {
    try {
        const reportes = await reporteService.getAll(req.usuario!.id, req.usuario!.rol);
        res.json(reportes);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/reportes/{id}:
 *   get:
 *     tags: [Reportes]
 *     summary: Obtener un reporte por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reporte'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Admin puede ver cualquier reporte, usuario solo el suyo
export async function getReporteById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const reporte = await reporteService.getById(id, req.usuario!.id, req.usuario!.rol);

        if (!reporte) {
            return next(new AppError('Reporte no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(reporte);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/reportes:
 *   post:
 *     tags: [Reportes]
 *     summary: Crear un nuevo reporte
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReporteInput'
 *     responses:
 *       200:
 *         description: Reporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
//Creo un nuevo reporte (asignando automaticamente el usuario del token)
export async function createReporte(req: Request, res: Response, next: NextFunction) {
    try {
        const reporte = await reporteService.create(req.body, req.usuario!.id);
        res.status(HttpStatus.SUCCESS).json(reporte);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/reportes/{id}:
 *   put:
 *     tags: [Reportes]
 *     summary: Actualizar un reporte existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReporteInput'
 *     responses:
 *       200:
 *         description: Reporte actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Admin puede actualizar cualquier reporte, usuario solo el suyo
export async function updateReporte(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const reporte = await reporteService.update(id, req.body, req.usuario!.id, req.usuario!.rol);

        if (!reporte) {
            return next(new AppError('Reporte no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(reporte);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/reportes/{id}:
 *   delete:
 *     tags: [Reportes]
 *     summary: Eliminar un reporte
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte
 *     responses:
 *       200:
 *         description: Reporte eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reporte eliminado correctamente
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
//Admin puede eliminar cualquier reporte, usuario solo el suyo
export async function deleteReporte(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const reporte = await reporteService.delete(id, req.usuario!.id, req.usuario!.rol);

        if (!reporte) {
            return next(new AppError('Reporte no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Reporte eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
