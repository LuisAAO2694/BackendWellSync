import {
    validateCreateRegistroDiario,
    validateUpdateRegistroDiario,
} from '../registroDiario.validator';

function mockReq(body: any) { return { body } as any; }
function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}
const mockNext = jest.fn();

beforeEach(() => { mockNext.mockClear(); });

describe('validateCreateRegistroDiario', () => {
    it('debe pasar con datos válidos', () => {
        const req = mockReq({ fecha: '2026-07-20', nivelEnergia: 3 });
        const res = mockRes();
        validateCreateRegistroDiario(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta fecha', () => {
        const req = mockReq({ nivelEnergia: 3 });
        const res = mockRes();
        validateCreateRegistroDiario(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La fecha es obligatoria']) });
    });

    it('debe rechazar fecha inválida', () => {
        const req = mockReq({ fecha: 'invalida', nivelEnergia: 3 });
        const res = mockRes();
        validateCreateRegistroDiario(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La fecha no es válida']) });
    });

    it('debe rechazar nivelEnergia menor a 1', () => {
        const req = mockReq({ fecha: '2026-07-20', nivelEnergia: 0 });
        const res = mockRes();
        validateCreateRegistroDiario(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El nivel de energía es obligatorio y debe ser un número entre 1 y 5']) });
    });

    it('debe rechazar nivelEnergia mayor a 5', () => {
        const req = mockReq({ fecha: '2026-07-20', nivelEnergia: 6 });
        const res = mockRes();
        validateCreateRegistroDiario(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El nivel de energía es obligatorio y debe ser un número entre 1 y 5']) });
    });

    it('debe rechazar nivelEnergia no numérico', () => {
        const req = mockReq({ fecha: '2026-07-20', nivelEnergia: 'alto' });
        const res = mockRes();
        validateCreateRegistroDiario(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El nivel de energía es obligatorio y debe ser un número entre 1 y 5']) });
    });

    it('debe validar habitosCompletados si se envía', () => {
        const req = mockReq({
            fecha: '2026-07-20',
            nivelEnergia: 3,
            habitosCompletados: [
                { habito: '507f1f77bcf86cd799439011', completado: true },
            ],
        });
        const res = mockRes();
        validateCreateRegistroDiario(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar habitoCompletado con ObjectId inválido', () => {
        const req = mockReq({
            fecha: '2026-07-20',
            nivelEnergia: 3,
            habitosCompletados: [{ habito: 'id-malo' }],
        });
        const res = mockRes();
        validateCreateRegistroDiario(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['Hábito completado 1: el ID del hábito es obligatorio y debe ser un ObjectId valido']),
        });
    });
});

describe('validateUpdateRegistroDiario', () => {
    it('debe pasar sin datos', () => {
        const req = mockReq({});
        const res = mockRes();
        validateUpdateRegistroDiario(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar nivelEnergia fuera de rango', () => {
        const req = mockReq({ nivelEnergia: 10 });
        const res = mockRes();
        validateUpdateRegistroDiario(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El nivel de energía debe ser un número entre 1 y 5']) });
    });
});
