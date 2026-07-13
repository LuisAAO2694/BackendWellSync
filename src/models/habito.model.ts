import mongoose, { Schema, Document, Types } from 'mongoose';
//Aqui el Types Contiene tipos especiales de Mongoose, como ObjectId

export interface IHabito extends Document {
    usuario: Types.ObjectId; //Aqui se hace referencia al usuario que es dueño del habito
    nombre: string;
    categoria: string;
    metaDiaria: string;
    horarioRecordatorio: string;
    activo: boolean;
    fechaCreacion: Date;
}

const habitosSchema = new Schema<IHabito>({
    usuario: {
        //usuario al que pertenece el habito
        type: Schema.Types.ObjectId, //Se almacena como un ObjectId
        ref: 'Usuario', //Referencia al modelo Usuario
        required: [true, 'El usuario es obligatorio'],
        index: true, //Indice para las busquedas
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del hábito es obligatorio'],
        trim: true,
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true,
    },
    metaDiaria: {
        type: String,
        required: [true, 'La meta diaria es obligatoria'],
    },
    horarioRecordatorio: {
        type: String,
    },
    activo: {
        //Indica si el hábito está activo o no
        type: Boolean,
        default: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});

export const Habito = mongoose.model<IHabito>('Habito', habitosSchema);
