import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-status';

//Esta es una expresion que usualemnte se usa para validar que un ID tenga el formato de un ObjectId de MongoDB
const objectIdRegex = /^[a-f\d]{24}$/i;

//Estados validos para un reporte
const estadosValidos = ['abierto', 'en_proceso', 'resuelto'];

//Este middleware valida los datos necesarios para crear un reporte
export function validateCreateReporte(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { usuario, tipo, descripcion, estado } = req.body;

    if (!usuario || typeof usuario !== 'string' || !objectIdRegex.test(usuario)) {
        errors.push('El ID del usuario es obligatorio y debe ser un ObjectId valido');
    }

    if (!tipo || typeof tipo !== 'string' || tipo.trim().length === 0) {
        errors.push('El tipo de reporte es obligatorio');
    }

    if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length === 0) {
        errors.push('La descripción es obligatoria');
    }

    if (estado !== undefined && !estadosValidos.includes(estado)) {
        errors.push(`Estado no valido. Debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}

//Y este es el middleware que valida los datos para actualizar un reporte
export function validateUpdateReporte(req: Request, res: Response, next: NextFunction) {
    const errors: string[] = [];
    const { tipo, descripcion, estado } = req.body;

    if (tipo !== undefined && (typeof tipo !== 'string' || tipo.trim().length === 0)) {
        errors.push('El tipo de reporte no puede estar vacio');
    }

    if (descripcion !== undefined && (typeof descripcion !== 'string' || descripcion.trim().length === 0)) {
        errors.push('La descripción no puede estar vacia');
    }

    if (estado !== undefined && !estadosValidos.includes(estado)) {
        errors.push(`Estado no valido. Debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}
