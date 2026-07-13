import mongoose, { Schema, Document, Types } from 'mongoose';

//Interfaz que define la estructura de un habito completado dentro de un registro diario
export interface IHabitoCompletado {
    habito: Types.ObjectId; //Ref -> habitos
    completado: boolean;
}

//Interfaz principal que define la estructura de los registros diarios
export interface IRegistroDiario extends Document {
    usuario: Types.ObjectId; //Ref -> usuarios
    fecha: Date;
    nivelEnergia: number; //Escala del 1 al 5
    habitosCompletados: IHabitoCompletado[];
}

const habitoCompletadoSchema = new Schema<IHabitoCompletado>(
    {
        habito: {
            type: Schema.Types.ObjectId,
            ref: 'Habito',
            required: [true, 'El hábito es obligatorio'],
        },
        completado: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false },
); //no necesita su propio id, siempre se consulta junto con el registro diario

const registroDiarioSchema = new Schema<IRegistroDiario>({
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
    nivelEnergia: {
        type: Number,
        required: [true, 'El nivel de energía es obligatorio'],
        min: [1, 'El nivel de energía mínimo es 1'],
        max: [5, 'El nivel de energía máximo es 5'],
    },
    habitosCompletados: {
        type: [habitoCompletadoSchema],
        default: [],
    },
});

export const RegistroDiario = mongoose.model<IRegistroDiario>('RegistroDiario', registroDiarioSchema);
