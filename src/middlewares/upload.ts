import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/utils';
import { HttpStatus } from '../types/http-status';

//Carpeta donde se guardan las fotos de perfil, se crea si no existe
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

//Configuracion de donde y con que nombre se guarda cada archivo
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        //Nombre unico por usuario y timestamp, para no pisar fotos de otros usuarios
        const ext = path.extname(file.originalname);
        cb(null, `${req.params.id}-${Date.now()}${ext}`);
    },
});

//Filtro para solo aceptar imagenes de estos 3 tipos
function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan JPG, PNG o WEBP'));
        return;
    }
    cb(null, true);
}

const uploadFotoPerfil = multer({
    storage,
    fileFilter,
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
