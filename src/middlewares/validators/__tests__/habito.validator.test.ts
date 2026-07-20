import {
    validateCreateHabito,
    validateUpdateHabito,
} from '../habito.validator';

function mockReq(body: any) { return { body } as any; }
function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}
const mockNext = jest.fn();

beforeEach(() => { mockNext.mockClear(); });

describe('validateCreateHabito', () => {
    it('debe pasar con datos válidos', () => {
        const req = mockReq({ nombre: 'Beber agua', categoria: 'Salud', metaDiaria: '8 vasos' });
        const res = mockRes();
        validateCreateHabito(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta nombre', () => {
        const req = mockReq({ categoria: 'Salud', metaDiaria: '8 vasos' });
        const res = mockRes();
        validateCreateHabito(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El nombre del habito es obligatorio']) });
    });

    it('debe rechazar si falta categoria', () => {
        const req = mockReq({ nombre: 'Beber agua', metaDiaria: '8 vasos' });
        const res = mockRes();
        validateCreateHabito(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La categoria es obligatoria']) });
    });

    it('debe rechazar si falta metaDiaria', () => {
        const req = mockReq({ nombre: 'Beber agua', categoria: 'Salud' });
        const res = mockRes();
        validateCreateHabito(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La meta diaria es obligatoria']) });
    });

    it('debe rechazar activo si no es booleano', () => {
        const req = mockReq({ nombre: 'Beber agua', categoria: 'Salud', metaDiaria: '8 vasos', activo: 'si' });
        const res = mockRes();
        validateCreateHabito(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El campo activo debe ser un booleano']) });
    });

    it('debe aceptar activo como booleano', () => {
        const req = mockReq({ nombre: 'Beber agua', categoria: 'Salud', metaDiaria: '8 vasos', activo: true });
        const res = mockRes();
        validateCreateHabito(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('validateUpdateHabito', () => {
    it('debe pasar sin datos', () => {
        const req = mockReq({});
        const res = mockRes();
        validateUpdateHabito(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar nombre vacío', () => {
        const req = mockReq({ nombre: '' });
        const res = mockRes();
        validateUpdateHabito(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El nombre no puede estar vacio']) });
    });

    it('debe rechazar activo si no es booleano', () => {
        const req = mockReq({ activo: 'true' });
        const res = mockRes();
        validateUpdateHabito(req, res, mockNext);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El campo activo debe ser un booleano']) });
    });
});
