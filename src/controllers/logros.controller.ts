import { NextFunction, Request, Response } from 'express';
import { logroService } from '../services/logro.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador para recibir las peticiones HTTP que vienen de los logros

//Obtengo todos los logros
export async function getAllLogros(req: Request, res: Response, next: NextFunction) {
    try {
        const logros = await logroService.getAll();
        res.json(logros);
    } catch (e) {
        next(e);
    }
}

//Obtengo un logro por su id
export async function getLogroById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const logro = await logroService.getById(id);

        if (!logro) {
            return next(new AppError('Logro no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(logro);
    } catch (e) {
        next(e);
    }
}

//Creo un nuevo logro
export async function createLogro(req: Request, res: Response, next: NextFunction) {
    try {
        const logro = await logroService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(logro);
    } catch (e) {
        next(e);
    }
}

//Actualizo un logro que ya existe
export async function updateLogro(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const logro = await logroService.update(id, req.body);

        if (!logro) {
            return next(new AppError('Logro no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(logro);
    } catch (e) {
        next(e);
    }
}

//Elimino un logro por su id
export async function deleteLogro(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const logro = await logroService.delete(id);

        if (!logro) {
            return next(new AppError('Logro no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Logro eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
