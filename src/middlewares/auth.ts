import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { HttpStatus } from '../types/http-status';

//Bien este es nuestro middleware para utenticar al usuario mediante un JWT

//Esta es la interfaz que define la info que esta almacenada dentro del token
export interface JwtPayload {
    id: string;
    rol: 'usuario' | 'administrador';
}

//OJO - Module Augmentation
//Esta parte de aqui es la extension de la interfaz Request de Express para agregar la propiedad de usuario
//En si su funcion es agregar una nueva propiedad (usuario) al objeto Request de Express
/*
    Osea que en cualquier controlador puedo hacer esto:
    const id = req.usuario?.id;
    const rol = req.usuario?.rol;
*/
declare global {
    namespace Express {
        interface Request {
            usuario?: JwtPayload;
        }
    }
}

//Este middleware restringe el acceso segun el rol del usuario
//Uso: router.get('/', authenticate, authorize('administrador'), handler)
export function authorize(...roles: ('usuario' | 'administrador')[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                error: { message: 'No tienes permisos para acceder a este recurso', statusCode: HttpStatus.FORBIDDEN },
            });
            return;
        }
        next();
    };
}

//Este es mi middlware que checa si el user envio un token valido
export function authenticate(req: Request, res: Response, next: NextFunction) {
    //Obengo el encabezado del auth de la peticion
    const authHeader = req.headers.authorization;

    //Checo que exista el encabezado y si tenga el fomato de Bearer
    //Y si no pues error bro
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            error: { message: 'Token no proporcionado', statusCode: HttpStatus.UNAUTHORIZED },
        });
        return;
    }

    //Extraigo solo el token del encabezado del auth
    const token = authHeader.split(' ')[1];

    try {
        //Checo que el token sea valido, uso la clave secreta
        const decode = jwt.verify(token, jwtConfig.secret) as JwtPayload;
        //Guardo la info del user que se obtuvo del token
        req.usuario = decode;
        next();
    } catch (e) {
        console.error('Error de autenticación:', e instanceof Error ? e.message : e);

        //Si mi token es invalido o bien ya expiro, devuelvo error
        res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            error: { message: 'Token inválido o expirado', statusCode: HttpStatus.UNAUTHORIZED },
        });
    }
}
