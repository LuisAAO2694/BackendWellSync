import { NextFunction, Request, Response } from 'express';
import { notificacionService } from '../services/notificacion.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

/**
 * @openapi
 * /api/notificaciones:
 *   get:
 *     tags: [Notificaciones]
 *     summary: Obtener todas las notificaciones del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 */
export async function getAllNotificaciones(req: Request, res: Response, next: NextFunction) {
    try {
        const notificaciones = await notificacionService.getAll(req.usuario!.id);
        res.json(notificaciones);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/notificaciones/{id}/leer:
 *   patch:
 *     tags: [Notificaciones]
 *     summary: Marcar una notificación como leída
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export async function marcarNotificacionLeida(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const notificacion = await notificacionService.marcarLeida(id, req.usuario!.id);

        if (!notificacion) {
            return next(new AppError('Notificación no encontrada', HttpStatus.NOT_FOUND));
        }

        res.json(notificacion);
    } catch (e) {
        next(e);
    }
}

/**
 * @openapi
 * /api/notificaciones/leer-todas:
 *   patch:
 *     tags: [Notificaciones]
 *     summary: Marcar todas las notificaciones del usuario autenticado como leídas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas las notificaciones marcadas como leídas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notificaciones marcadas como leídas
 */
export async function marcarTodasNotificacionesLeidas(req: Request, res: Response, next: NextFunction) {
    try {
        await notificacionService.marcarTodasLeidas(req.usuario!.id);
        res.json({ message: 'Notificaciones marcadas como leídas' });
    } catch (e) {
        next(e);
    }
}
