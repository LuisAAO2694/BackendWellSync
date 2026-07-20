import {
    validateCreateUsuario,
    validateUpdateUsuario,
    validateForgotPassword,
    validateResetPassword,
    validateGoogleLogin,
} from '../usuario.validator';
import { HttpStatus } from '../../../types/http-status';

function mockReq(body: any) {
    return { body } as any;
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

describe('validateCreateUsuario', () => {
    it('debe pasar con datos válidos (sin googleId)', () => {
        const req = mockReq({ nombre: 'Juan', email: 'juan@test.com', password: '12345678' });
        const res = mockRes();
        validateCreateUsuario(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('debe pasar con googleId y sin password', () => {
        const req = mockReq({ nombre: 'Juan', email: 'juan@test.com', googleId: 'google-123' });
        const res = mockRes();
        validateCreateUsuario(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta el nombre', () => {
        const req = mockReq({ email: 'juan@test.com', password: '12345678' });
        const res = mockRes();
        validateCreateUsuario(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El nombre es obligatorio']) });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe rechazar email inválido', () => {
        const req = mockReq({ nombre: 'Juan', email: 'invalido', password: '12345678' });
        const res = mockRes();
        validateCreateUsuario(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['Email no válido']) });
    });

    it('debe rechazar password menor a 8 caracteres (sin googleId)', () => {
        const req = mockReq({ nombre: 'Juan', email: 'juan@test.com', password: '123' });
        const res = mockRes();
        validateCreateUsuario(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La contraseña debe tener al menos 8 caracteres']) });
    });
});

describe('validateUpdateUsuario', () => {
    it('debe pasar si no se envía ningún campo', () => {
        const req = mockReq({});
        const res = mockRes();
        validateUpdateUsuario(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe pasar con datos válidos', () => {
        const req = mockReq({ nombre: 'Juan', email: 'juan@test.com' });
        const res = mockRes();
        validateUpdateUsuario(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar nombre vacío', () => {
        const req = mockReq({ nombre: '' });
        const res = mockRes();
        validateUpdateUsuario(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El nombre no puede estar vacio']) });
    });

    it('debe rechazar email inválido', () => {
        const req = mockReq({ email: 'mal' });
        const res = mockRes();
        validateUpdateUsuario(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['Email no valido']) });
    });

    it('debe rechazar password menor a 8 caracteres', () => {
        const req = mockReq({ password: '123' });
        const res = mockRes();
        validateUpdateUsuario(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La contraseña debe tener al menos 8 caracteres']) });
    });

    it('debe rechazar rol inválido', () => {
        const req = mockReq({ rol: 'superadmin' });
        const res = mockRes();
        validateUpdateUsuario(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['Rol no valido. Debe ser "usuario" o "administrador"']) });
    });

    it('debe aceptar rol válido', () => {
        const req = mockReq({ rol: 'administrador' });
        const res = mockRes();
        validateUpdateUsuario(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});

describe('validateForgotPassword', () => {
    it('debe pasar con email válido', () => {
        const req = mockReq({ email: 'juan@test.com' });
        const res = mockRes();
        validateForgotPassword(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta el email', () => {
        const req = mockReq({});
        const res = mockRes();
        validateForgotPassword(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El email es obligatorio']) });
    });

    it('debe rechazar email inválido', () => {
        const req = mockReq({ email: 'no-es-un-email' });
        const res = mockRes();
        validateForgotPassword(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['Email no válido']) });
    });
});

describe('validateResetPassword', () => {
    it('debe pasar con token y password válidos', () => {
        const req = mockReq({ token: 'abc123', password: 'newpassword123' });
        const res = mockRes();
        validateResetPassword(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta el token', () => {
        const req = mockReq({ password: 'newpassword123' });
        const res = mockRes();
        validateResetPassword(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El token es obligatorio']) });
    });

    it('debe rechazar si la password es menor a 8 caracteres', () => {
        const req = mockReq({ token: 'abc123', password: '123' });
        const res = mockRes();
        validateResetPassword(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['La nueva contraseña debe tener al menos 8 caracteres']) });
    });
});

describe('validateGoogleLogin', () => {
    it('debe pasar con idToken válido', () => {
        const req = mockReq({ idToken: 'token-de-google' });
        const res = mockRes();
        validateGoogleLogin(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar si falta el idToken', () => {
        const req = mockReq({});
        const res = mockRes();
        validateGoogleLogin(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.arrayContaining(['El idToken de Google es obligatorio']) });
    });
});
