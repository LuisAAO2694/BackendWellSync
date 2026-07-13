import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-status';

//Esta es una expresion que usualemnte se usa para validar que un ID tenga el formato de un ObjectId de MongoDB
const objectIdRegex = /^[a-f\d]{24}$/i;

//Este middleware mas que nada se encarga de validar los datos para crear un entrenamiento
export function validateCreateEntrenamiento(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { usuario, fecha, hora, estado, notasGenerales, ejercicios } = req.body;

    if (!usuario || typeof usuario !== 'string' || !objectIdRegex.test(usuario)) {
        errors.push('El ID del usuario es obligatorio y debe ser un ObjectId valido');
    }

    if (!fecha) {
        errors.push('La fecha es obligatoria');
    } else if (isNaN(new Date(fecha).getTime())) {
        errors.push('La fecha no es válida');
    }

    if (!hora || typeof hora !== 'string' || hora.trim().length === 0) {
        errors.push('La hora es obligatoria');
    }

    if (estado && !['pendiente', 'completado'].includes(estado)) {
        errors.push('Estado no valido. Debe ser "pendiente" o "completado"');
    }

    if (notasGenerales !== undefined && typeof notasGenerales !== 'string') {
        errors.push('Las notas generales deben ser un texto');
    }

    //Valida que exista al menos un ejercicio
    if (!ejercicios || !Array.isArray(ejercicios) || ejercicios.length === 0) {
        errors.push('Debe incluir al menos un ejercicio');
    } else {
        ejercicios.forEach((ej, index) => {
            if (!ej.exerciseId || typeof ej.exerciseId !== 'string') {
                errors.push(`Ejercicio ${index + 1}: exerciseId es obligatorio`);
            }
            if (!ej.nombre || typeof ej.nombre !== 'string') {
                errors.push(`Ejercicio ${index + 1}: nombre es obligatorio`);
            }
            if (ej.series === undefined || typeof ej.series !== 'number' || ej.series < 1) {
                errors.push(`Ejercicio ${index + 1}: series debe ser un número mayor a 0`);
            }
            if (ej.repeticiones === undefined || typeof ej.repeticiones !== 'number' || ej.repeticiones < 1) {
                errors.push(`Ejercicio ${index + 1}: repeticiones debe ser un número mayor a 0`);
            }
            if (ej.peso !== undefined && (typeof ej.peso !== 'number' || ej.peso < 0)) {
                errors.push(`Ejercicio ${index + 1}: peso no puede ser negativo`);
            }
            if (ej.completado !== undefined && typeof ej.completado !== 'boolean') {
                errors.push(`Ejercicio ${index + 1}: completado debe ser un booleano`);
            }
        });
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}

//Y bueno este esta encargado de validar los datos para actualizar un entrenamiento
export function validateUpdateEntrenamiento(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { fecha, hora, estado, notasGenerales, ejercicios } = req.body;

    if (fecha !== undefined && isNaN(new Date(fecha).getTime())) {
        errors.push('La fecha no es valida');
    }

    if (hora !== undefined && (typeof hora !== 'string' || hora.trim().length === 0)) {
        errors.push('La hora no es valida');
    }

    if (estado !== undefined && !['pendiente', 'completado'].includes(estado)) {
        errors.push('Estado no valido. Debe ser "pendiente" o "completado"');
    }

    if (notasGenerales !== undefined && typeof notasGenerales !== 'string') {
        errors.push('Las notas generales deben ser un texto');
    }

    //Si se envia el arreglo de ejercicios btw valida su contenido.
    if (ejercicios !== undefined) {
        if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
            errors.push('Debe incluir al menos un ejercicio');
        } else {
            ejercicios.forEach((ej, index) => {
                if (!ej.exerciseId || typeof ej.exerciseId !== 'string') {
                    errors.push(`Ejercicio ${index + 1}: exerciseId es obligatorio`);
                }
                if (!ej.nombre || typeof ej.nombre !== 'string') {
                    errors.push(`Ejercicio ${index + 1}: nombre es obligatorio`);
                }
                if (ej.series === undefined || typeof ej.series !== 'number' || ej.series < 1) {
                    errors.push(`Ejercicio ${index + 1}: series debe ser un numero mayor a 0`);
                }
                if (ej.repeticiones === undefined || typeof ej.repeticiones !== 'number' || ej.repeticiones < 1) {
                    errors.push(`Ejercicio ${index + 1}: repeticiones debe ser un numero mayor a 0`);
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
