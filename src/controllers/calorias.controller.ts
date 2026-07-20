import { NextFunction, Request, Response } from 'express';
import { caloriaService } from '../services/calorias.service';

/**
 * @openapi
 * /api/calorias/calcular:
 *   get:
 *     tags: [Calorias]
 *     summary: Calcular calorías quemadas por actividad
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: actividad
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la actividad (ej. "running", "swimming")
 *       - in: query
 *         name: weight
 *         schema:
 *           type: string
 *         description: Peso en libras (opcional, default 160)
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *         description: Duración en minutos (opcional, default 60)
 *     responses:
 *       200:
 *         description: Calorías quemadas calculadas
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
//Este es controlador calcula las calorias quemadas segun la actividad fisica que se hizo
export async function calcularCalorias(req: Request, res: Response, next: NextFunction) {
    try {
        const { actividad, weight, duration } = req.query as Record<string, string | undefined>;

        if (!actividad || typeof actividad !== 'string') {
            res.status(400).json({ errors: ['El parámetro "actividad" es obligatorio'] });
            return;
        }

        const result = await caloriaService.calcular(actividad, weight, duration);
        res.json(result);
    } catch (e) {
        next(e);
    }
}
