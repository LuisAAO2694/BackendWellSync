import { Usuario, IUsuario } from '../models/usuario.model';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { AppError } from '../utils/utils';
import { HttpStatus } from '../types/http-status';
import crypto from 'crypto'; //Operacion criptografica
import { emailService } from './email.service';
import { verifyGoogleToken } from '../config/google';
import cloudinary from '../config/cloudinary';

function extractPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
}

//Aqui manejamos el servicio que se encarga de gestinar las operaciones CRUD
//Es el intermediario entre los controladores y los models osea | [CONTROLADORES] ---> [SERVICES] ---> [MODELS] |

export const usuarioService = {
    //.select('-password') para no devolver la contraseña
    async getAll(): Promise<IUsuario[]> {
        return await Usuario.find().select('-password');
    },

    //Admin puede ver cualquier usuario, usuario normal solo su propio perfil
    async getById(id: string, usuarioId: string, rol: string): Promise<IUsuario | null> {
        if (rol !== 'administrador' && id !== usuarioId) {
            throw new AppError('No tienes permisos para ver este perfil', HttpStatus.FORBIDDEN);
        }
        return await Usuario.findById(id).select('-password');
    },

    //Creo un nuevo usuario con la data que reciba
    async create(data: Partial<IUsuario>): Promise<IUsuario | null> {
        //Partial convierte todas las propiedades de una interfaz en opcionales
        const usuario = await Usuario.create(data);
        return await Usuario.findById(usuario._id).select('-password');
    },

    //Admin puede actualizar cualquier usuario, usuario normal solo su propio perfil
    async update(id: string, data: Partial<IUsuario>, usuarioId: string, rol: string): Promise<IUsuario | null> {
        if (rol !== 'administrador' && id !== usuarioId) {
            throw new AppError('No tienes permisos para actualizar este perfil', HttpStatus.FORBIDDEN);
        }
        //Uso findById + save() para que se ejecute el pre('save') y encripte la password tambien
        const usuario = await Usuario.findById(id);
        if (!usuario) return null;

        Object.assign(usuario, data);
        await usuario.save(); //Aqui se dispara el pre('save') y hashea la password si cambio
        return await Usuario.findById(usuario._id).select('-password');
    },

    //Elimino un usuario por su ID (solo admin, se valida desde la ruta)
    async delete(id: string): Promise<IUsuario | null> {
        return await Usuario.findByIdAndDelete(id);
    },

    //Aqui inicio sesion checando las credenciales del user
    //Si pasan, genera un token
    async login(email: string, password: string): Promise<{ token: string }> {
        //Busco al usuario por su correo
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            //Si no existe pues error
            throw new AppError('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        //Si el usuario no tiene contrasena (ej. registro con Google), no puede usar email/password
        if (!usuario.password) {
            throw new AppError('Esta cuenta usa inicio de sesión con Google. Inicia sesión con Google.', HttpStatus.UNAUTHORIZED);
        }

        //Aqui comparo la contrasela con la que esta en la bd
        const isPasswordValid = await usuario.comparePassword(password);

        //Si no pasa, lanzo error
        if (!isPasswordValid) {
            throw new AppError('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        //Aqui genero el token con el id y el rol del usuario
        const token = jwt.sign(
            //Esta es la info que tendra el token
            { id: usuario._id, rol: usuario.rol },
            jwtConfig.secret, //Clave secreta
            { expiresIn: jwtConfig.expiresIn }, //lo que tarda el token en expirar
        );

        //Devuelvo la info del token
        return { token };
    },

    //Bien aqui, genero un token de recuperacion y envio el correo al usuario
    async forgotPassword(email: string): Promise<{ message: string }> {
        //Busco el user por su email
        const usuario = await Usuario.findOne({ email });

        //Aqui en si por seguridad, simepre devuelvo el mismo mensaje, aunque el correo no exista
        if (!usuario) {
            return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
        }

        //Genero el token aleatorio
        const rawToken = crypto.randomBytes(32).toString('hex');

        //Creo un hash del token para almacenarlo de forma segura
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        //Guardo el token y la fecha de expiracion (1 hora, pero lo podemos cambiar)
        usuario.resetPasswordToken = hashedToken;
        usuario.resetPasswordExpires = new Date(Date.now() + 3600000);

        //Guardo los cambios
        await usuario.save();

        //Envio al user un correo con el enlace para recuperar
        await emailService.sendResetPasswordEmail(usuario.email, rawToken);
        return { message: 'Si el correo existe, recibirás un enlace de recuperación' };
    },

    //Aqui restablezco la pass utilizando el token que me llego
    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        //Genero el hash del token recibido para comparalo con el que tengo guardado
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        //Busco el usuario con ese token y checo que o haya expirado
        const usuario = await Usuario.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() }, //La fecha debe ser mayor a la actual
        });

        //Si mi token no exite o expiro, le lanzo un error
        if (!usuario) {
            throw new AppError('Token inválido o expirado', HttpStatus.BAD_REQUEST);
        }

        //Actualizo la pass del user
        usuario.password = newPassword;

        //Elimino el token y la fecha de expiracion para evitar cositas jajaj
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        //Gurado los cambios
        await usuario.save();

        return { message: 'Contraseña actualizada correctamente' };
    },

    //Aqui solo es mi inicio de sesion con google
    async googleLogin(idToken: string): Promise<{ token: string }> {
        //Checo que el idtoken de google sea valido y obtengo la info del user
        const profile = await verifyGoogleToken(idToken);

        //Busco el usuarios asociado
        let usuario = await Usuario.findOne({ googleId: profile.googleId });

        //Si no existe
        if (!usuario) {
            //Busco si ya existe uno registrado con el mismo correo
            usuario = await Usuario.findOne({ email: profile.email });
            if (usuario) {
                //Vinculo la cuenta existente con google
                usuario.googleId = profile.googleId;

                //Actualizo la foto de perfil si es que tiene una
                if (profile.fotoPerfil) usuario.fotoPerfil = profile.fotoPerfil;

                //Guardo los cambios
                await usuario.save();
            } else {
                //Si el usuario no existe, pues le creo nueva cuenta
                usuario = await Usuario.create({
                    nombre: profile.nombre,
                    email: profile.email,
                    googleId: profile.googleId,
                    fotoPerfil: profile.fotoPerfil,
                });
            }
        }

        //Genera un token JWT para autenticar al usuario en la aplicacion
        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn,
        });

        //Devuelvo el token generado
        return { token };
    },

    //Actualiza la foto de perfil subida por multer, solo si el usuario es dueño o admin
    async actualizarFotoPerfil(
        id: string,
        fotoUrl: string,
        publicId: string,
        usuarioId: string,
        rol: string,
    ): Promise<IUsuario | null> {
        if (rol !== 'administrador' && id !== usuarioId) {
            throw new AppError('No tienes permisos para actualizar este perfil', HttpStatus.FORBIDDEN);
        }

        const usuario = await Usuario.findById(id);
        if (!usuario) return null;

        //Borrar foto anterior de Cloudinary si existe
        if (usuario.fotoPerfil && usuario.fotoPerfil.includes('cloudinary')) {
            const oldPublicId = extractPublicIdFromUrl(usuario.fotoPerfil);
            if (oldPublicId) {
                cloudinary.uploader.destroy(oldPublicId, () => {});
            }
        }

        usuario.fotoPerfil = fotoUrl;
        await usuario.save();

        return await Usuario.findById(usuario._id).select('-password');
    },
};
