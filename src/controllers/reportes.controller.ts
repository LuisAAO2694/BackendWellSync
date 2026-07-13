import { NextFunction, Request, Response } from 'express';
import { reporteService } from '../services/reporte.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador para recibir las peticiones HTTP que vienen de los reportes

//Obtengo todos los reportes
export async function getAllReportes(req: Request, res: Response, next: NextFunction) {
    try {
        const reportes = await reporteService.getAll();
        res.json(reportes);
    } catch (e) {
        next(e);
    }
}

//Obtengo un reporte por su id
export async function getReporteById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const reporte = await reporteService.getById(id);

        if (!reporte) {
            return next(new AppError('Reporte no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(reporte);
    } catch (e) {
        next(e);
    }
}

//Creo un nuevo reporte
export async function createReporte(req: Request, res: Response, next: NextFunction) {
    try {
        const reporte = await reporteService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(reporte);
    } catch (e) {
        next(e);
    }
}

//Actualizo un reporte que ya existe
export async function updateReporte(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const reporte = await reporteService.update(id, req.body);

        if (!reporte) {
            return next(new AppError('Reporte no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(reporte);
    } catch (e) {
        next(e);
    }
}

//Elimino un reporte por su id
export async function deleteReporte(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const reporte = await reporteService.delete(id);

        if (!reporte) {
            return next(new AppError('Reporte no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Reporte eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
