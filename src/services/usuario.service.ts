import { Usuario, IUsuario } from '../models/usuario.model';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { AppError } from '../utils/utils';
import { HttpStatus } from '../types/http-status';

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
};
