import { NextFunction, Request, Response } from 'express';
import { habitoService } from '../services/habito.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador recibir las peticiones HTTP que vienen de los habitos

//Obtengo los habitos
export async function getAllHabitos(req: Request, res: Response, next: NextFunction) {
    try {
        const habitos = await habitoService.getAll();
        res.json(habitos);
    } catch (e) {
        next(e);
    }
}

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

//Creo un nuevo habito
export async function createHabito(req: Request, res: Response, next: NextFunction) {
    try {
        const habito = await habitoService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(habito);
    } catch (e) {
        next(e);
    }
}

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
