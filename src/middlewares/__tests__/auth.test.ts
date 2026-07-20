import jwt from 'jsonwebtoken';
import { authenticate, authorize, JwtPayload } from '../auth';
import { HttpStatus } from '../../types/http-status';

jest.mock('jsonwebtoken');

function mockReq(headers?: any, usuario?: JwtPayload) {
    return { headers: headers || {}, usuario } as any;
}

function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

const mockNext = jest.fn();

beforeEach(() => {
    mockNext.mockClear();
});

describe('authenticate', () => {
    it('debe llamar next() si el token es válido', () => {
        const payload: JwtPayload = { id: 'user123', rol: 'usuario' };
        (jwt.verify as jest.Mock).mockReturnValue(payload);

        const req = mockReq({ authorization: 'Bearer token-valido' });
        const res = mockRes();
        authenticate(req, res, mockNext);

        expect(jwt.verify).toHaveBeenCalledWith('token-valido', expect.any(String));
        expect(req.usuario).toEqual(payload);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe devolver 401 si no hay header de autorización', () => {
        const req = mockReq({});
        const res = mockRes();
        authenticate(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: { message: 'Token no proporcionado', statusCode: HttpStatus.UNAUTHORIZED },
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe devolver 401 si el header no es Bearer', () => {
        const req = mockReq({ authorization: 'Basic token' });
        const res = mockRes();
        authenticate(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: { message: 'Token no proporcionado', statusCode: HttpStatus.UNAUTHORIZED },
        });
    });

    it('debe devolver 401 si el token es inválido', () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('jwt malformed');
        });

        const req = mockReq({ authorization: 'Bearer token-malo' });
        const res = mockRes();
        authenticate(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: { message: 'Token inválido o expirado', statusCode: HttpStatus.UNAUTHORIZED },
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe devolver 401 si el token expiró', () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('jwt expired');
        });

        const req = mockReq({ authorization: 'Bearer token-expirado' });
        const res = mockRes();
        authenticate(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: { message: 'Token inválido o expirado', statusCode: HttpStatus.UNAUTHORIZED },
        });
    });
});

describe('authorize', () => {
    it('debe llamar next() si el rol coincide', () => {
        const req = mockReq({}, { id: 'user123', rol: 'administrador' });
        const res = mockRes();
        const middleware = authorize('administrador');
        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    it('debe devolver 403 si el rol no coincide', () => {
        const req = mockReq({}, { id: 'user123', rol: 'usuario' });
        const res = mockRes();
        const middleware = authorize('administrador');
        middleware(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: { message: 'No tienes permisos para acceder a este recurso', statusCode: HttpStatus.FORBIDDEN },
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe aceptar múltiples roles', () => {
        const req = mockReq({}, { id: 'user123', rol: 'usuario' });
        const res = mockRes();
        const middleware = authorize('usuario', 'administrador');
        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    it('debe devolver 403 si no hay usuario en req', () => {
        const req = mockReq({}, undefined);
        const res = mockRes();
        const middleware = authorize('usuario');
        middleware(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
