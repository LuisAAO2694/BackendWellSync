import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';
//Schema es para 'definir como se guardan los datos' y el Document 'define como se comporta un documento una vez que existe en la bd'

//Interface que define la estructura de el usuario
//Pusimos que extendia de document para poder heredar las propiedades y metdodos
export interface IUsuario extends Document {
    nombre: string;
    email: string;
    password?: string;
    googleId?: string;
    fotoPerfil?: string;
    rol: 'usuario' | 'administrador';
    fechaRegistro: Date;
}

//Este en si es el esquema que define como se almacenan los usuarios en la bd
const usuarioSchema = new Schema<IUsuario>({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
    }, 
    email:{
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    googleId:{
        type: String,
    },
    fotoPerfil:{
        type: String,
    },
    rol:{
        type: String,
        enum: ['usuario', 'administrador'], //Restringimos el campo a solo esos valores
        default: 'usuario',
    },
    fechaRegistro:{
        type: Date,
        default: Date.now,
    }
});

//Pre-save para hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
    //Si la contraseñan o fue modificada o no existe, continua con el guardado
    if (!this.isModified('password') || !this.password) return next();
    //Este salt es para seguridad 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Metodo para comparar contraseñas (para login futuro en construccion jajaj)
usuarioSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    //Checo si la contraseña que se ingreso coincide con la contraseña cifrada en la bd
    return bcrypt.compare(password, this.password);
};

//Ya aqui solo lo exportamos como modelo de mongoose que nos permite realizar operaciones
export const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);