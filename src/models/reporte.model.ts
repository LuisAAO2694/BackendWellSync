import mongoose, { Schema, Document, Types } from 'mongoose';

//Interfaz que define la estructura de los reportes
export interface IReporte extends Document {
    usuario: Types.ObjectId; //Ref -> usuarios (quien lo creo)
    tipo: string; //Eje. "bug", "contenido"
    descripcion: string;
    estado: 'abierto' | 'en_proceso' | 'resuelto';
    fechaCreacion: Date;
}

const reporteSchema = new Schema<IReporte>({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio'],
        index: true,
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de reporte es obligatorio'],
        trim: true,
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
    },
    estado: {
        type: String,
        enum: ['abierto', 'en_proceso', 'resuelto'],
        default: 'abierto',
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});

export const Reporte = mongoose.model<IReporte>('Reporte', reporteSchema);
