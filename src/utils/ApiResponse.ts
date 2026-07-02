import { Response } from 'express';

export function success<T>(res: Response, statusCode: number, data: T, message = 'OK') {
  return res.status(statusCode).json({ success: true, message, data });
}
