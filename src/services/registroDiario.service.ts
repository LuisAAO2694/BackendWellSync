import { RegistroDiario, IRegistroDiario } from '../models/registroDiario.model';

export const registroDiarioService = {
    //Solo devuelve los registros diarios del usuario autenticado
    async getAll(usuarioId: string): Promise<IRegistroDiario[]> {
        return await RegistroDiario.find({ usuario: usuarioId });
    },

    //Busca un registro diario por su id, solo si pertenece al usuario autenticado
    async getById(id: string, usuarioId: string): Promise<IRegistroDiario | null> {
        return await RegistroDiario.findOne({ _id: id, usuario: usuarioId });
    },

    //Crea un registro diario forzando el usuario del token por seguridad
    async create(data: Partial<IRegistroDiario>, usuarioId: string): Promise<IRegistroDiario> {
        return await RegistroDiario.create({ ...data, usuario: usuarioId });
    },

    //Actualiza un registro diario, solo si pertenece al usuario autenticado
    async update(id: string, data: Partial<IRegistroDiario>, usuarioId: string): Promise<IRegistroDiario | null> {
        return await RegistroDiario.findOneAndUpdate({ _id: id, usuario: usuarioId }, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    },

    //Elimina un registro diario, solo si pertenece al usuario autenticado
    async delete(id: string, usuarioId: string): Promise<IRegistroDiario | null> {
        return await RegistroDiario.findOneAndDelete({ _id: id, usuario: usuarioId });
    },
};
