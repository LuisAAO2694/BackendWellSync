import mongoose, { Schema, Document, Types } from 'mongoose';

//Interfaz que define la estructura de las notificaciones
export interface INotificacion extends Document {
    usuario: Types.ObjectId; //Ref -> usuarios
    tipo: string; //Eje. "logro"
    mensaje: string;
    leida: boolean;
    fecha: Date;
    referenciaId?: Types.ObjectId; //Id opcional del recurso que disparo la notificacion
}

const notificacionSchema = new Schema<INotificacion>({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio'],
        index: true,
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de notificación es obligatorio'],
        trim: true,
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje es obligatorio'],
        trim: true,
    },
    leida: {
        type: Boolean,
        default: false,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    referenciaId: {
        type: Schema.Types.ObjectId,
    },
});

export const Notificacion = mongoose.model<INotificacion>('Notificacion', notificacionSchema);
