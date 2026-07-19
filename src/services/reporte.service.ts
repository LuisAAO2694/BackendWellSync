import { Reporte, IReporte } from '../models/reporte.model';

export const reporteService = {
    //Admin ve todos los reportes, usuario solo los suyos
    async getAll(usuarioId: string, rol: string): Promise<IReporte[]> {
        const filter = rol === 'administrador' ? {} : { usuario: usuarioId };
        return await Reporte.find(filter);
    },

    //Admin puede ver cualquier reporte, usuario solo el suyo
    async getById(id: string, usuarioId: string, rol: string): Promise<IReporte | null> {
        const filter = rol === 'administrador' ? { _id: id } : { _id: id, usuario: usuarioId };
        return await Reporte.findOne(filter);
    },

    //Crea un reporte forzando el usuario del token por seguridad
    async create(data: Partial<IReporte>, usuarioId: string): Promise<IReporte> {
        return await Reporte.create({ ...data, usuario: usuarioId });
    },

    //Admin puede actualizar cualquier reporte, usuario solo el suyo
    async update(id: string, data: Partial<IReporte>, usuarioId: string, rol: string): Promise<IReporte | null> {
        const filter = rol === 'administrador' ? { _id: id } : { _id: id, usuario: usuarioId };
        return await Reporte.findOneAndUpdate(filter, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    },

    //Admin puede eliminar cualquier reporte, usuario solo el suyo
    async delete(id: string, usuarioId: string, rol: string): Promise<IReporte | null> {
        const filter = rol === 'administrador' ? { _id: id } : { _id: id, usuario: usuarioId };
        return await Reporte.findOneAndDelete(filter);
    },
};
