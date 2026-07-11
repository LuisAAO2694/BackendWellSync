import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-status';

//Esta es una expresion que usualemnte se usa para validar que un ID tenga el formato de un ObjectId de MongoDB
const objectIdRegex = /^[a-f\d]{24}$/i;

//Este es el middleware que valida los datos necesarios para crear un habito
export function validateCreateHabito(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { usuario, nombre, categoria, metaDiaria, horarioRecordatorio, activo } = req.body;

    //Valido que el ID del usuario exista y tenga el formato de un ObjectId
    if (!usuario || typeof usuario !== 'string' || !objectIdRegex.test(usuario)) {
        errors.push('El ID del usuario es obligatorio y debe ser un ObjectId valido');
    }
    //Valida que el nombre del habito exista y no esté vacio
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        errors.push('El nombre del habito es obligatorio');
    }

    //Valido que la categoria exista y no este vacia
    if (!categoria || typeof categoria !== 'string' || categoria.trim().length === 0) {
        errors.push('La categoria es obligatoria');
    }

    if (!metaDiaria || typeof metaDiaria !== 'string' || metaDiaria.trim().length === 0) {
        errors.push('La meta diaria es obligatoria');
    }

    if (horarioRecordatorio !== undefined && (typeof horarioRecordatorio !== 'string' || horarioRecordatorio.trim().length === 0)) {
        errors.push('El horario de recordatorio no es valido');
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
        errors.push('El campo activo debe ser un booleano');
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}

//Y este es el middleware que valida los datos para actualizar un habito
export function validateUpdateHabito(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { nombre, categoria, metaDiaria, horarioRecordatorio, activo } = req.body;

    //Si se envia el nombre, valida que no este vacio
    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim().length === 0)) {
        errors.push('El nombre no puede estar vacio');
    }

    //Y asi btw jaja
    if (categoria !== undefined && (typeof categoria !== 'string' || categoria.trim().length === 0)) {
        errors.push('La categoría no puede estar vacia');
    }

    if (metaDiaria !== undefined && (typeof metaDiaria !== 'string' || metaDiaria.trim().length === 0)) {
        errors.push('La meta diaria no puede estar vacia');
    }

    if (horarioRecordatorio !== undefined && (typeof horarioRecordatorio !== 'string' || horarioRecordatorio.trim().length === 0)) {
        errors.push('El horario de recordatorio no es valido');
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
        errors.push('El campo activo debe ser un booleano');
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}