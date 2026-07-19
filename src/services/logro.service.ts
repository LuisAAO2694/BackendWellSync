import { Logro, ILogro } from '../models/logro.model';
import { notificacionService } from './notificacion.service';

export const logroService = {
    //Solo devuelve los logros del usuario autenticado
    async getAll(usuarioId: string): Promise<ILogro[]> {
        return await Logro.find({ usuario: usuarioId });
    },

    //Busca un logro por su id, solo si pertenece al usuario autenticado
    async getById(id: string, usuarioId: string): Promise<ILogro | null> {
        return await Logro.findOne({ _id: id, usuario: usuarioId });
    },

    //Crea un logro forzando el usuario del token por seguridad, y notifica al usuario
    async create(data: Partial<ILogro>, usuarioId: string): Promise<ILogro> {
        const logro = await Logro.create({ ...data, usuario: usuarioId });

        try {
            await notificacionService.crear(
                usuarioId,
                'logro',
                `¡Has desbloqueado un logro: ${logro.tipo}!`,
                logro._id.toString(),
            );
        } catch (e) {
            console.error('Error al crear la notificación del logro:', e);
        }

        return logro;
    },

    //Actualiza un logro, solo si pertenece al usuario autenticado
    async update(id: string, data: Partial<ILogro>, usuarioId: string): Promise<ILogro | null> {
        return await Logro.findOneAndUpdate({ _id: id, usuario: usuarioId }, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    },

    //Elimina un logro, solo si pertenece al usuario autenticado
    async delete(id: string, usuarioId: string): Promise<ILogro | null> {
        return await Logro.findOneAndDelete({ _id: id, usuario: usuarioId });
    },
};
