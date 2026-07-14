import { NextFunction, Request, Response } from 'express';
import { usuarioService } from '../services/usuario.service';
import { HttpStatus } from '../types/http-status';
import { AppError } from '../utils/utils';

//Este es solo mi controlador recibir las peticiones HTTP que vienen de los usuarios

//Obtengo todos los usuarios
export async function getAllUsuarios(req: Request, res: Response, next: NextFunction) {
    try {
        const usuarios = await usuarioService.getAll();
        res.json(usuarios);
    } catch (e) {
        next(e);
    }
}
//Obtengo un usuario por su ID
export async function getUsuarioById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.getById(id);

        if (!usuario) {
            return next(new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json(usuario);
    } catch (e) {
        next(e);
    }
}

//Creo un nuevo usuario
export async function createUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const usuario = await usuarioService.create(req.body);
        res.status(HttpStatus.SUCCESS).json(usuario);
    } catch (e) {
        next(e);
    }
}

//Actualizo un usuario existente
export async function updateUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.update(id, req.body);

        if (!usuario) {
            return next(new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND));
        }
        res.json(usuario);
    } catch (e) {
        next(e);
    }
}

//Aqui pues solo lo elimino
export async function deleteUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.delete(id);

        if (!usuario) {
            return next(new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND));
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (e) {
        next(e);
    }
}

//Este es el controlador que procesa la soli de login
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        //Nomas obtengo el correo y la contraseña en la peticion
        const {email, password} = req.body;
        //Llamo al service para validar las credenciales 
        const result = await usuarioService.login(email, password);
        res.json(result);
    } catch (e) {
        next(e);
    }
}
