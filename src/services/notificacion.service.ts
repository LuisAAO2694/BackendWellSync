import { Notificacion, INotificacion } from '../models/notificacion.model';
import { emitirAUsuario } from '../sockets/sockets';

export const notificacionService = {
    //Crea la notificacion, la persiste y la emite en tiempo real si el usuario esta conectado
    async crear(usuarioId: string, tipo: string, mensaje: string, referenciaId?: string): Promise<INotificacion> {
        const notificacion = await Notificacion.create({
            usuario: usuarioId,
            tipo,
            mensaje,
            referenciaId,
        });

        emitirAUsuario(usuarioId, 'notificacion:nueva', notificacion);

        return notificacion;
    },

    //Devuelve las notificaciones del usuario autenticado, mas recientes primero
    async getAll(usuarioId: string): Promise<INotificacion[]> {
        return await Notificacion.find({ usuario: usuarioId }).sort({ fecha: -1 });
    },

    //Marca una notificacion como leida, solo si pertenece al usuario autenticado
    async marcarLeida(id: string, usuarioId: string): Promise<INotificacion | null> {
        return await Notificacion.findOneAndUpdate({ _id: id, usuario: usuarioId }, { leida: true }, { new: true });
    },

    //Marca todas las notificaciones no leidas del usuario como leidas
    async marcarTodasLeidas(usuarioId: string): Promise<void> {
        await Notificacion.updateMany({ usuario: usuarioId, leida: false }, { leida: true });
    },
};
