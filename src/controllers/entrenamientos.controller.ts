import { NextFunction, Request, Response } from 'express';
import { entrenamientoService } from '../services/entrenamiento.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador recibir las peticiones HTTP que vienen de los entrenamientos

//Obtengo todos los entrenamientos
export async function getAllEntrenamientos(req: Request, res: Response, next: NextFunction) {
    try {
        const entrenamientos = await entrenamientoService.getAll();
        res.json(entrenamientos);
    } catch (e) {
        next(e);
    }
}

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

//Creo un nuevo entrenamiento
export async function createEntrenamiento(req: Request, res: Response, next: NextFunction) {
    try {
        const entrenamiento = await entrenamientoService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(entrenamiento);
    } catch (e) {
        next(e);
    }
}

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
