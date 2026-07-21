import { validateCreateEntrenamiento, validateUpdateEntrenamiento } from '../entrenamiento.validator';
import { mockReq, mockRes } from '../../../test/test-utils';

const mockNext = jest.fn();

beforeEach(() => {
    mockNext.mockClear();
});

const ejercicioValido = { exerciseId: 'exr_123', nombre: 'Bench Press', series: 3, repeticiones: 10 };

describe('validateCreateEntrenamiento', () => {
    it('debe pasar con datos válidos', () => {
        const req = mockReq({ fecha: '2026-07-20', hora: '10:00', ejercicios: [ejercicioValido] });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta fecha', () => {
        const req = mockReq({ hora: '10:00', ejercicios: [ejercicioValido] });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La fecha es obligatoria']) });
    });

    it('debe rechazar fecha inválida', () => {
        const req = mockReq({ fecha: 'no-es-fecha', hora: '10:00', ejercicios: [ejercicioValido] });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La fecha no es válida']) });
    });

    it('debe rechazar si falta hora', () => {
        const req = mockReq({ fecha: '2026-07-20', ejercicios: [ejercicioValido] });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La hora es obligatoria']) });
    });

    it('debe rechazar estado inválido', () => {
        const req = mockReq({ fecha: '2026-07-20', hora: '10:00', estado: 'en_curso', ejercicios: [ejercicioValido] });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['Estado no valido. Debe ser "pendiente" o "completado"']),
        });
    });

    it('debe rechazar si no hay ejercicios', () => {
        const req = mockReq({ fecha: '2026-07-20', hora: '10:00', ejercicios: [] });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['Debe incluir al menos un ejercicio']),
        });
    });

    it('debe rechazar ejercicio sin exerciseId', () => {
        const req = mockReq({
            fecha: '2026-07-20',
            hora: '10:00',
            ejercicios: [{ nombre: 'Press', series: 3, repeticiones: 10 }],
        });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['Ejercicio 1: exerciseId es obligatorio']),
        });
    });

    it('debe rechazar ejercicio con series menor a 1', () => {
        const req = mockReq({ fecha: '2026-07-20', hora: '10:00', ejercicios: [{ ...ejercicioValido, series: 0 }] });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['Ejercicio 1: series debe ser un número mayor a 0']),
        });
    });

    it('debe rechazar peso negativo', () => {
        const req = mockReq({ fecha: '2026-07-20', hora: '10:00', ejercicios: [{ ...ejercicioValido, peso: -5 }] });
        const res = mockRes();
        validateCreateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['Ejercicio 1: peso no puede ser negativo']),
        });
    });
});

describe('validateUpdateEntrenamiento', () => {
    it('debe pasar sin datos', () => {
        const req = mockReq({});
        const res = mockRes();
        validateUpdateEntrenamiento(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar fecha inválida', () => {
        const req = mockReq({ fecha: 'invalida' });
        const res = mockRes();
        validateUpdateEntrenamiento(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La fecha no es valida']) });
    });

    it('debe aceptar datos parciales válidos', () => {
        const req = mockReq({ estado: 'completado' });
        const res = mockRes();
        validateUpdateEntrenamiento(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe validar ejercicios si se envían', () => {
        const req = mockReq({ ejercicios: [ejercicioValido] });
        const res = mockRes();
        validateUpdateEntrenamiento(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});
