import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new ApiError(404, `Ruta no encontrada: ${req.originalUrl}`));
}
