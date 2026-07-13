import { NextFunction, Request, Response } from 'express';
import { registroDiarioService } from '../services/registroDiario.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador para recibir las peticiones HTTP que vienen de los registros diarios

//Obtengo todos los registros diarios
export async function getAllRegistrosDiarios(req: Request, res: Response, next: NextFunction) {
    try {
        const registros = await registroDiarioService.getAll();
        res.json(registros);
    } catch (e) {
        next(e);
    }
}

//Obtengo un registro diario por su id
export async function getRegistroDiarioById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.getById(id);

        if (!registro) {
            return next(new AppError('Registro diario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(registro);
    } catch (e) {
        next(e);
    }
}

//Creo un nuevo registro diario
export async function createRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const registro = await registroDiarioService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(registro);
    } catch (e) {
        next(e);
    }
}

//Actualizo un registro diario que ya existe
export async function updateRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.update(id, req.body);

        if (!registro) {
            return next(new AppError('Registro diario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(registro);
    } catch (e) {
        next(e);
    }
}

//Elimino un registro diario por su id
export async function deleteRegistroDiario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const registro = await registroDiarioService.delete(id);

        if (!registro) {
            return next(new AppError('Registro diario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Registro diario eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}
