import mongoose, { Schema, Document, Types } from 'mongoose';

//Interfaz que define la estructura de los logros
export interface ILogro extends Document {
    usuario: Types.ObjectId; //Ref -> usuarios
    tipo: string; //Eje. "racha_7_dias", "primer_mes"
    habitoRelacionado?: Types.ObjectId; //Ref -> habitos (opcional)
    fechaObtenido: Date;
}

const logroSchema = new Schema<ILogro>({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio'],
        index: true,
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de logro es obligatorio'],
        trim: true,
    },
    habitoRelacionado: {
        type: Schema.Types.ObjectId,
        ref: 'Habito', //opcional, algunos logros no estan ligados a un habito especifico
    },
    fechaObtenido: {
        type: Date,
        default: Date.now,
    }
});

export const Logro = mongoose.model<ILogro>('Logro', logroSchema);
