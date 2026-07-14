import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-status';

//ruta -> middleware de validación -> controlador

//Este es el middleware encargado de validar los datos para crear un usuario
export function validateCreateUsuario(req: Request, res: Response, next: NextFunction) {
    //Aqui hacemos un simple arreglo donde alamcenare los errores btw que se encuentren
    const errors: string[] = [];
    //Ya aqui obtengo los datos de la peticion
    const { nombre, email, password, googleId } = req.body;

    //Nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        errors.push('El nombre es obligatorio');
    }

    //Email
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
        errors.push('El email es obligatorio');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email no válido');
    }

    //Btw este es caso particular si no inicia con google, la contraseña es obligatoria
    if (!googleId && (!password || typeof password !== 'string' || password.length < 8)) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    //Y ya si existe un error me devuelve la lista
    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    //Le sigo con el siguiente middleware o en su caso controlador
    next();
}

//Este otro middleware es el que se encarga de checar los datos para actualizar el usurio
//Btw solo valido los campos
export function validateUpdateUsuario(req: Request, res: Response, next: NextFunction) {
    //Aqui hacemos un simple arreglo donde alamcenare los errores btw que se encuentren
    const errors: string[] = [];
    const { nombre, email, password, rol } = req.body;

    //Si se envia el nombre, valido que no este vacio
    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim().length === 0)) {
        errors.push('El nombre no puede estar vacio');
    }

    //btw si se envia el email, valido que temga el formato correcto
    if (email !== undefined) {
        if (typeof email !== 'string' || email.trim().length === 0) {
            errors.push('El email no puede estar vacio');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Email no valido');
        }
    }

    //Si se envia la contraseña, valida que tenga al menos 8 caracteres
    if (password !== undefined && (typeof password !== 'string' || password.length < 8)) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (rol !== undefined && !['usuario', 'administrador'].includes(rol)) {
        errors.push('Rol no valido. Debe ser "usuario" o "administrador"');
    }

    if (errors.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ errors });
        return;
    }

    next();
}
