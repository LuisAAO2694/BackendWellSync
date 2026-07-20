import { usuarioService } from '../usuario.service';
import { Usuario } from '../../models/usuario.model';
import jwt from 'jsonwebtoken';
import { verifyGoogleToken } from '../../config/google';
import { emailService } from '../email.service';

jest.mock('../../models/usuario.model');
jest.mock('jsonwebtoken');
jest.mock('../../config/google');
jest.mock('../email.service');

const mockUsuario = {
    _id: 'user123',
    nombre: 'Juan',
    email: 'juan@test.com',
    password: 'hashed_password',
    rol: 'usuario',
    fotoPerfil: undefined,
    googleId: undefined,
    comparePassword: jest.fn(),
    save: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getAll', () => {
    it('debe devolver todos los usuarios sin password', async () => {
        (Usuario.find as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue([mockUsuario]),
        });

        const result = await usuarioService.getAll();
        expect(result).toEqual([mockUsuario]);
        expect(Usuario.find).toHaveBeenCalled();
    });
});

describe('getById', () => {
    it('admin puede ver cualquier usuario', async () => {
        (Usuario.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUsuario),
        });

        const result = await usuarioService.getById('user456', 'admin123', 'administrador');
        expect(result).toEqual(mockUsuario);
    });

    it('usuario normal solo puede verse a sí mismo', async () => {
        (Usuario.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUsuario),
        });

        const result = await usuarioService.getById('user123', 'user123', 'usuario');
        expect(result).toEqual(mockUsuario);
    });

    it('usuario normal no puede ver otro perfil', async () => {
        await expect(
            usuarioService.getById('otro-user', 'user123', 'usuario'),
        ).rejects.toThrow('No tienes permisos para ver este perfil');
    });
});

describe('create', () => {
    it('debe crear un usuario y devolverlo sin password', async () => {
        const data = { nombre: 'Juan', email: 'juan@test.com', password: '12345678' };
        (Usuario.create as jest.Mock).mockResolvedValue({ _id: 'new123', ...data });
        (Usuario.findById as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({ _id: 'new123', ...data, password: undefined }),
        });

        const result = await usuarioService.create(data);
        expect(Usuario.create).toHaveBeenCalledWith(data);
        expect(result?.password).toBeUndefined();
    });
});

describe('delete', () => {
    it('debe eliminar un usuario por ID', async () => {
        (Usuario.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUsuario);

        const result = await usuarioService.delete('user123');
        expect(Usuario.findByIdAndDelete).toHaveBeenCalledWith('user123');
        expect(result).toEqual(mockUsuario);
    });
});

describe('login', () => {
    it('debe generar un token si las credenciales son válidas', async () => {
        const mockUser = { ...mockUsuario, _id: 'user123' };
        mockUser.comparePassword.mockResolvedValue(true);
        (Usuario.findOne as jest.Mock).mockResolvedValue(mockUser);
        (jwt.sign as jest.Mock).mockReturnValue('jwt-token');

        const result = await usuarioService.login('juan@test.com', '12345678');
        expect(result).toEqual({ token: 'jwt-token' });
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'user123', rol: 'usuario' },
            expect.any(String),
            expect.objectContaining({ expiresIn: expect.any(String) }),
        );
    });

    it('debe lanzar error si el usuario no existe', async () => {
        (Usuario.findOne as jest.Mock).mockResolvedValue(null);

        await expect(usuarioService.login('no@existe.com', '12345678')).rejects.toThrow('Credenciales inválidas');
    });

    it('debe lanzar error si la contraseña es incorrecta', async () => {
        const mockUser = { ...mockUsuario };
        mockUser.comparePassword.mockResolvedValue(false);
        (Usuario.findOne as jest.Mock).mockResolvedValue(mockUser);

        await expect(usuarioService.login('juan@test.com', 'wrong')).rejects.toThrow('Credenciales inválidas');
    });
});

describe('googleLogin', () => {
    const googleProfile = { googleId: 'google-123', email: 'juan@gmail.com', nombre: 'Juan Google', fotoPerfil: 'https://photo.url' };

    it('debe loguear usuario existente por googleId', async () => {
        const existingUser = { ...mockUsuario, _id: 'user123', googleId: 'google-123' };
        (verifyGoogleToken as jest.Mock).mockResolvedValue(googleProfile);
        (Usuario.findOne as jest.Mock).mockResolvedValue(existingUser);
        (jwt.sign as jest.Mock).mockReturnValue('google-jwt');

        const result = await usuarioService.googleLogin('valid-token');
        expect(result).toEqual({ token: 'google-jwt' });
        expect(Usuario.findOne).toHaveBeenCalledWith({ googleId: 'google-123' });
    });

    it('debe vincular googleId a cuenta existente por email', async () => {
        const userWithoutGoogle = { ...mockUsuario, _id: 'user123', googleId: undefined, save: jest.fn() };
        (verifyGoogleToken as jest.Mock).mockResolvedValue(googleProfile);
        (Usuario.findOne as jest.Mock)
            .mockResolvedValueOnce(null) // no existe por googleId
            .mockResolvedValueOnce(userWithoutGoogle); // existe por email
        (jwt.sign as jest.Mock).mockReturnValue('google-jwt');

        const result = await usuarioService.googleLogin('valid-token');
        expect(result).toEqual({ token: 'google-jwt' });
        expect(userWithoutGoogle.googleId).toBe('google-123');
        expect(userWithoutGoogle.save).toHaveBeenCalled();
    });

    it('debe crear nuevo usuario si no existe', async () => {
        (verifyGoogleToken as jest.Mock).mockResolvedValue(googleProfile);
        (Usuario.findOne as jest.Mock)
            .mockResolvedValueOnce(null) // no existe por googleId
            .mockResolvedValueOnce(null); // no existe por email
        (Usuario.create as jest.Mock).mockResolvedValue({ _id: 'new123', ...googleProfile, rol: 'usuario' });
        (jwt.sign as jest.Mock).mockReturnValue('google-jwt');

        const result = await usuarioService.googleLogin('valid-token');
        expect(result).toEqual({ token: 'google-jwt' });
        expect(Usuario.create).toHaveBeenCalledWith({
            nombre: 'Juan Google',
            email: 'juan@gmail.com',
            googleId: 'google-123',
            fotoPerfil: 'https://photo.url',
        });
    });
});

describe('forgotPassword', () => {
    it('debe enviar mensaje genérico si el correo no existe', async () => {
        (Usuario.findOne as jest.Mock).mockResolvedValue(null);

        const result = await usuarioService.forgotPassword('no@existe.com');
        expect(result).toEqual({ message: 'Si el correo existe, recibirás un enlace de recuperación' });
    });

    it('debe generar token y enviar email si el usuario existe', async () => {
        const user = { ...mockUsuario, save: jest.fn(), resetPasswordToken: undefined, resetPasswordExpires: undefined };
        (Usuario.findOne as jest.Mock).mockResolvedValue(user);
        (emailService.sendResetPasswordEmail as jest.Mock).mockResolvedValue(undefined);

        const result = await usuarioService.forgotPassword('juan@test.com');
        expect(result).toEqual({ message: 'Si el correo existe, recibirás un enlace de recuperación' });
        expect(user.save).toHaveBeenCalled();
        expect(emailService.sendResetPasswordEmail).toHaveBeenCalledWith(
            'juan@test.com',
            expect.any(String),
        );
    });
});

describe('resetPassword', () => {
    it('debe restablecer la contraseña si el token es válido', async () => {
        const user = { ...mockUsuario, save: jest.fn() };
        (Usuario.findOne as jest.Mock).mockResolvedValue(user);
        user.save.mockResolvedValue(user);

        const result = await usuarioService.resetPassword('valid-token', 'newpassword123');
        expect(result).toEqual({ message: 'Contraseña actualizada correctamente' });
        expect(user.password).toBe('newpassword123');
        expect(user.save).toHaveBeenCalled();
    });

    it('debe lanzar error si el token es inválido o expiró', async () => {
        (Usuario.findOne as jest.Mock).mockResolvedValue(null);

        await expect(usuarioService.resetPassword('bad-token', 'newpassword123')).rejects.toThrow(
            'Token inválido o expirado',
        );
    });
});

describe('update', () => {
    it('admin puede actualizar cualquier usuario', async () => {
        const user = { ...mockUsuario, save: jest.fn(), _id: 'user123' };
        user.save.mockResolvedValue(user);
        (Usuario.findById as jest.Mock)
            .mockResolvedValueOnce(user)
            .mockReturnValueOnce({ select: jest.fn().mockResolvedValue({ ...user, nombre: 'Nuevo Nombre' }) });

        const result = await usuarioService.update('user123', { nombre: 'Nuevo Nombre' }, 'admin123', 'administrador');
        expect(result).toBeDefined();
    });

    it('usuario normal solo puede actualizar su propio perfil', async () => {
        const user = { ...mockUsuario, save: jest.fn(), _id: 'user123' };
        user.save.mockResolvedValue(user);
        (Usuario.findById as jest.Mock)
            .mockResolvedValueOnce(user)
            .mockReturnValueOnce({ select: jest.fn().mockResolvedValue({ ...user, nombre: 'Nuevo' }) });

        const result = await usuarioService.update('user123', { nombre: 'Nuevo' }, 'user123', 'usuario');
        expect(result).toBeDefined();
    });

    it('usuario normal no puede actualizar otro perfil', async () => {
        await expect(
            usuarioService.update('otro-user', { nombre: 'Hack' }, 'user123', 'usuario'),
        ).rejects.toThrow('No tienes permisos para actualizar este perfil');
    });

    it('debe devolver null si el usuario no existe', async () => {
        (Usuario.findById as jest.Mock).mockResolvedValue(null);

        const result = await usuarioService.update('no-existe', { nombre: 'Test' }, 'admin123', 'administrador');
        expect(result).toBeNull();
    });
});
