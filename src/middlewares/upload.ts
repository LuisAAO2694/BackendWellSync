import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/utils';
import { HttpStatus } from '../types/http-status';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

const uploadFotoPerfil = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
            cb(new Error('Tipo de archivo no permitido. Solo se aceptan JPG, PNG o WEBP'));
            return;
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }, //2MB
});

//Envuelve multer para convertir sus errores en AppError, en vez de tumbar el request con un 500
export function subirFoto(req: Request, res: Response, next: NextFunction) {
    uploadFotoPerfil.single('foto')(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            next(new AppError('El archivo excede el tamaño máximo de 2MB', HttpStatus.BAD_REQUEST));
            return;
        }
        if (err instanceof Error) {
            next(new AppError(err.message, HttpStatus.BAD_REQUEST));
            return;
        }
        next();
    });
}
