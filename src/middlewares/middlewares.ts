import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/utils';
import { HttpStatus } from '../types/http-status';

//Middleware global para manejar los errors
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    
    //Nomas checo si el error es una instancia de la clase AppError
    //Y si si devuelvo el message
    if (err instanceof AppError){
        res.status(err.statusCode).json({
            success: false,
            error: { message: err.message, statusCode: err.statusCode },
        });
        return;
    }

    //Simple log
    console.error('Error inesperado:/ :', err);

    //Devuelvo un res generico btw
    res.status(HttpStatus.SERVER_ERROR).json({
        success: false,
        error: { message: 'Error interno del servidor', statusCode: HttpStatus.SERVER_ERROR },
    });
}