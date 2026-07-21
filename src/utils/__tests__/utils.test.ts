import { AppError } from '../utils';

describe('AppError', () => {
    it('debe crear un error con mensaje y statusCode', () => {
        const error = new AppError('Algo salió mal', 400);
        expect(error.message).toBe('Algo salió mal');
        expect(error.statusCode).toBe(400);
        expect(error.isOperational).toBe(true);
        expect(error).toBeInstanceOf(Error);
    });

    it('debe permitir isOperational false', () => {
        const error = new AppError('Error interno', 500, false);
        expect(error.message).toBe('Error interno');
        expect(error.statusCode).toBe(500);
        expect(error.isOperational).toBe(false);
    });

    it('debe ser instancia de Error', () => {
        const error = new AppError('Test', 403);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
    });

    it('debe tener el prototipo correcto', () => {
        const error = new AppError('Test', 404);
        expect(Object.getPrototypeOf(error)).toBe(AppError.prototype);
    });
});
