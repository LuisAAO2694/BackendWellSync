import { validateCreateReporte, validateUpdateReporte } from '../reporte.validator';
import { mockReq, mockRes } from '../../../test/test-utils';

const mockNext = jest.fn();

beforeEach(() => {
    mockNext.mockClear();
});

describe('validateCreateReporte', () => {
    it('debe pasar con datos válidos', () => {
        const req = mockReq({ tipo: 'Bug', descripcion: 'Error al iniciar sesión' });
        const res = mockRes();
        validateCreateReporte(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta tipo', () => {
        const req = mockReq({ descripcion: 'Error' });
        const res = mockRes();
        validateCreateReporte(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['El tipo de reporte es obligatorio']),
        });
    });

    it('debe rechazar si falta descripcion', () => {
        const req = mockReq({ tipo: 'Bug' });
        const res = mockRes();
        validateCreateReporte(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La descripción es obligatoria']) });
    });

    it('debe rechazar estado inválido', () => {
        const req = mockReq({ tipo: 'Bug', descripcion: 'Error', estado: 'inexistente' });
        const res = mockRes();
        validateCreateReporte(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['Estado no valido. Debe ser uno de: abierto, en_proceso, resuelto']),
        });
    });

    it('debe aceptar estado válido', () => {
        const req = mockReq({ tipo: 'Bug', descripcion: 'Error', estado: 'en_proceso' });
        const res = mockRes();
        validateCreateReporte(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('validateUpdateReporte', () => {
    it('debe pasar sin datos', () => {
        const req = mockReq({});
        const res = mockRes();
        validateUpdateReporte(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar estado inválido', () => {
        const req = mockReq({ estado: 'cancelado' });
        const res = mockRes();
        validateUpdateReporte(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining(['Estado no valido. Debe ser uno de: abierto, en_proceso, resuelto']),
        });
    });
});
