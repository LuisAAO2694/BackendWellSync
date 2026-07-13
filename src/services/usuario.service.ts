import { Usuario, IUsuario } from '../models/usuario.model';

//Aqui manejamos el servicio que se encarga de gestinar las operaciones CRUD
//Es el intermediario entre los controladores y los models osea | [CONTROLADORES] ---> [SERVICES] ---> [MODELS] |

export const usuarioService = {
    //.select('-password') para no devolver la contraseña
    async getAll(): Promise<IUsuario[]> {
        return await Usuario.find().select('-password');
    },

    //Para no devolver la contraseña
    async getById(id: string): Promise<IUsuario | null> {
        return await Usuario.findById(id).select('-password');
    },

    //Creo un nuevo usuario con la data que reciba
    async create(data: Partial<IUsuario>): Promise<IUsuario | null> {
        //Partial convierte todas las propiedades de una interfaz en opcionales
        const usuario = await Usuario.create(data);
        return await Usuario.findById(usuario._id).select('-password');
    },

    //Actualizo un usuario existente por su ID
    //Uso findById + save() para que se ejecute el pre('save') y encripte la password tambien
    async update(id: string, data: Partial<IUsuario>): Promise<IUsuario | null> {
        const usuario = await Usuario.findById(id);
        if (!usuario) return null;

        Object.assign(usuario, data);
        await usuario.save(); //Aqui se dispara el pre('save') y hashea la password si cambio
        return await Usuario.findById(usuario._id).select('-password');
    },

    //Elimino un usuario por su ID
    async delete(id: string): Promise<IUsuario | null> {
        return await Usuario.findByIdAndDelete(id);
    },
};
