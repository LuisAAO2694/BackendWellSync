import { Habito, IHabito } from '../models/habito.model';

export const habitoService = {
    //Solo devuelve los habitos del usuario autenticado
    async getAll(usuarioId: string): Promise<IHabito[]> {
        return await Habito.find({ usuario: usuarioId });
    },

    //Busca un habito por su id, pero solo si pertenece al usuario autenticado
    async getById(id: string, usuarioId: string): Promise<IHabito | null> {
        return await Habito.findOne({ _id: id, usuario: usuarioId });
    },

    //Crea un habito forzando el usuario del token por seguridad
    async create(data: Partial<IHabito>, usuarioId: string): Promise<IHabito> {
        return await Habito.create({ ...data, usuario: usuarioId });
    },

    //Actualiza un habito, pero solo si pertenece al usuario autenticado
    async update(id: string, data: Partial<IHabito>, usuarioId: string): Promise<IHabito | null> {
        return await Habito.findOneAndUpdate({ _id: id, usuario: usuarioId }, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    }, //Aqui se usa un Partial y un Promise.
    /*
        Partial se usa para permitir actualizar unicamente los campos del documento que yo quiera, 
        y Promise se usa porque la operacion de MongoDB es asincrona y devuelve el resultado
    */

    //Elimina un habito, pero solo si pertenece al usuario autenticado
    async delete(id: string, usuarioId: string): Promise<IHabito | null> {
        return await Habito.findOneAndDelete({ _id: id, usuario: usuarioId });
    },
};
