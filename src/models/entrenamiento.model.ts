import mongoose, { Schema, Document, Types } from 'mongoose';

//Esta de aqui es mi interfaz que define la structure de un ejercicio dentro de un entrenamiento
//Lo del SubDoc
export interface IEjercicio {
    exerciseId: string;
    nombre: string;
    series: number;
    repeticiones: number;
    peso: number;
    completado: boolean;
    notaPersonal?: string;
}

//Esta si es mi interfaz principal que define la estructura de los entrenamientos
export interface IEntrenamiento extends Document {
    usuario: Types.ObjectId; //Referencia al usuarios propietario del entrenamiento
    fecha: Date;
    hora: string;
    estado: 'pendiente' | 'completado';
    notasGenerales?: string;
    ejercicios: IEjercicio[]; //La lista de ejercicios dentro del entrenamiento
}

//
const ejercicioSchema = new Schema<IEjercicio>(
    {
        exerciseId: {
            type: String,
            required: [true, 'El exerciseId es obligatorio'],
        },
        nombre: {
            type: String,
            required: [true, 'El nombre del ejercicio es obligatorio'],
        },
        series: {
            type: Number,
            required: [true, 'Las series son obligatorias'],
            min: [1, 'Debe haber al menos 1 serie'],
        },
        repeticiones: {
            type: Number,
            required: [true, 'Las repeticiones son obligatorias'],
            min: [1, 'Debe haber al menos 1 repetición'],
        },
        peso: {
            type: Number,
            default: 0,
            min: [0, 'El peso no puede ser negativo'],
        },
        completado: {
            type: Boolean,
            default: false,
        },
        notaPersonal: {
            type: String,
        },
    },
    { _id: false },
); //en el subSchema (cada ejercicio no necesita su propio ID) nunca consulto un ejercicio por separado

//Este es mi esquema que define como se almacenas los entrenamietnos
const entrenamientoSchema = new Schema<IEntrenamiento>({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio'],
        index: true,
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
    },
    hora: {
        type: String,
        required: [true, 'La hora es obligatoria'],
    },
    estado: {
        type: String,
        enum: ['pendiente', 'completado'],
        default: 'pendiente',
    },
    notasGenerales: {
        type: String,
    },
    ejercicios: {
        type: [ejercicioSchema],
        default: [],
    },
});

export const Entrenamiento = mongoose.model<IEntrenamiento>('Entrenamiento', entrenamientoSchema);
