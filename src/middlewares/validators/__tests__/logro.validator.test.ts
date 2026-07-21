import { validateCreateLogro, validateUpdateLogro } from '../logro.validator';
import { mockReq, mockRes } from '../../../test/test-utils';

const mockNext = jest.fn();

beforeEach(() => {
    mockNext.mockClear();
});

describe('validateCreateLogro', () => {
    it('debe pasar con datos válidos', () => {
        const req = mockReq({ tipo: 'Racha 7 días' });
        const res = mockRes();
        validateCreateLogro(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta tipo', () => {
        const req = mockReq({});
        const res = mockRes();
        validateCreateLogro(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El tipo de logro es obligatorio']) });
    });

    it('debe rechazar fechaObtenido inválida', () => {
        const req = mockReq({ tipo: 'Racha', fechaObtenido: 'no-es-fecha' });
        const res = mockRes();
        validateCreateLogro(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La fecha obtenida no es válida']) });
    });

    it('debe rechazar habitoRelacionado inválido', () => {
        const req = mockReq({ tipo: 'Racha', habitoRelacionado: 'id-invalido' });
        const res = mockRes();
        validateCreateLogro(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['El hábito relacionado debe ser un ObjectId valido']),
        });
    });

    it('debe aceptar habitoRelacionado como ObjectId válido', () => {
        const req = mockReq({ tipo: 'Racha', habitoRelacionado: '507f1f77bcf86cd799439011' });
        const res = mockRes();
        validateCreateLogro(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('validateUpdateLogro', () => {
    it('debe pasar sin datos', () => {
        const req = mockReq({});
        const res = mockRes();
        validateUpdateLogro(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar tipo vacío', () => {
        const req = mockReq({ tipo: '' });
        const res = mockRes();
        validateUpdateLogro(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['El tipo de logro no puede estar vacio']),
        });
    });
});
