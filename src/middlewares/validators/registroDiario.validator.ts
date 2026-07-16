import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-status';

//Esta es una expresion que usualemnte se usa para validar que un ID tenga el formato de un ObjectId de MongoDB
const objectIdRegex = /^[a-f\d]{24}$/i;

//Este middleware valida los datos necesarios para crear un registro diario
export function validateCreateRegistroDiario(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { fecha, nivelEnergia, habitosCompletados } = req.body;

    if (!fecha) {
        errors.push('La fecha es obligatoria');
    } else if (isNaN(new Date(fecha).getTime())) {
        errors.push('La fecha no es válida');
    }

    if (nivelEnergia === undefined || typeof nivelEnergia !== 'number' || nivelEnergia < 1 || nivelEnergia > 5) {
        errors.push('El nivel de energía es obligatorio y debe ser un número entre 1 y 5');
    }

    //Si se envia el arreglo de habitos completados, valida su contenido
    if (habitosCompletados !== undefined) {
        if (!Array.isArray(habitosCompletados)) {
            errors.push('Los hábitos completados deben ser un arreglo');
        } else {
            habitosCompletados.forEach((hc, index) => {
                if (!hc.habito || typeof hc.habito !== 'string' || !objectIdRegex.test(hc.habito)) {
                    errors.push(
                        `Hábito completado ${index + 1}: el ID del hábito es obligatorio y debe ser un ObjectId valido`,
                    );
                }
                if (hc.completado !== undefined && typeof hc.completado !== 'boolean') {
                    errors.push(`Hábito completado ${index + 1}: completado debe ser un booleano`);
                }
            });
        }
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}

//Y este es el middleware que valida los datos para actualizar un registro diario
export function validateUpdateRegistroDiario(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { fecha, nivelEnergia, habitosCompletados } = req.body;

    if (fecha !== undefined && isNaN(new Date(fecha).getTime())) {
        errors.push('La fecha no es válida');
    }

    if (nivelEnergia !== undefined && (typeof nivelEnergia !== 'number' || nivelEnergia < 1 || nivelEnergia > 5)) {
        errors.push('El nivel de energía debe ser un número entre 1 y 5');
    }

    if (habitosCompletados !== undefined) {
        if (!Array.isArray(habitosCompletados)) {
            errors.push('Los hábitos completados deben ser un arreglo');
        } else {
            habitosCompletados.forEach((hc, index) => {
                if (!hc.habito || typeof hc.habito !== 'string' || !objectIdRegex.test(hc.habito)) {
                    errors.push(
                        `Hábito completado ${index + 1}: el ID del hábito es obligatorio y debe ser un ObjectId valido`,
                    );
                }
                if (hc.completado !== undefined && typeof hc.completado !== 'boolean') {
                    errors.push(`Hábito completado ${index + 1}: completado debe ser un booleano`);
                }
            });
        }
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}
