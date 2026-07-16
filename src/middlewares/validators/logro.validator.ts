import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-status';

//Esta es una expresion que usualemnte se usa para validar que un ID tenga el formato de un ObjectId de MongoDB
const objectIdRegex = /^[a-f\d]{24}$/i;

//Este middleware valida los datos necesarios para crear un logro
export function validateCreateLogro(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { tipo, fechaObtenido, habitoRelacionado } = req.body;

    if (!tipo || typeof tipo !== 'string' || tipo.trim().length === 0) {
        errors.push('El tipo de logro es obligatorio');
    }

    if (fechaObtenido !== undefined && isNaN(new Date(fechaObtenido).getTime())) {
        errors.push('La fecha obtenida no es válida');
    }

    //El habito relacionado es opcional, pero si se envia debe ser un ObjectId valido
    if (
        habitoRelacionado !== undefined &&
        (typeof habitoRelacionado !== 'string' || !objectIdRegex.test(habitoRelacionado))
    ) {
        errors.push('El hábito relacionado debe ser un ObjectId valido');
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}

//Y este es el middleware que valida los datos para actualizar un logro
export function validateUpdateLogro(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { tipo, fechaObtenido, habitoRelacionado } = req.body;

    if (tipo !== undefined && (typeof tipo !== 'string' || tipo.trim().length === 0)) {
        errors.push('El tipo de logro no puede estar vacio');
    }

    if (fechaObtenido !== undefined && isNaN(new Date(fechaObtenido).getTime())) {
        errors.push('La fecha obtenida no es válida');
    }

    if (
        habitoRelacionado !== undefined &&
        (typeof habitoRelacionado !== 'string' || !objectIdRegex.test(habitoRelacionado))
    ) {
        errors.push('El hábito relacionado debe ser un ObjectId valido');
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}
