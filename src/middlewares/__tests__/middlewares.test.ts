import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../middlewares';
import { AppError } from '../../utils/utils';

function mockReq() { return {} as Request; }
function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}
const mockNext = jest.fn() as NextFunction;

describe('errorHandler', () => {
    it('debe responder con el statusCode y mensaje de AppError', () => {
        const req = mockReq();
        const res = mockRes();
        const error = new AppError('Recurso no encontrado', 404);

        errorHandler(error, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: { message: 'Recurso no encontrado', statusCode: 404 },
        });
    });

    it('debe responder 500 para errores que no son AppError', () => {
        const req = mockReq();
        const res = mockRes();
        const error = new Error('Algo inesperado');

        errorHandler(error, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: { message: 'Error interno del servidor', statusCode: 500 },
        });
    });

    it('debe usar isOperational false correctamente', () => {
        const req = mockReq();
        const res = mockRes();
        const error = new AppError('Error de programación', 500, false);

        errorHandler(error, req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: { message: 'Error de programación', statusCode: 500 },
        });
    });
});
