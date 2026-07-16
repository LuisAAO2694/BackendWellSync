import { Entrenamiento, IEntrenamiento } from '../models/entrenamiento.model';

export const entrenamientoService = {
    //Solo devuelve los entrenamientos del usuario autenticado
    async getAll(usuarioId: string): Promise<IEntrenamiento[]> {
        return await Entrenamiento.find({ usuario: usuarioId });
    },

    //Busca un entrenamiento por su id, solo si pertenece al usuario autenticado
    async getById(id: string, usuarioId: string): Promise<IEntrenamiento | null> {
        return await Entrenamiento.findOne({ _id: id, usuario: usuarioId });
    },

    //Crea un entrenamiento forzando el usuario del token por seguridad
    async create(data: Partial<IEntrenamiento>, usuarioId: string): Promise<IEntrenamiento> {
        return await Entrenamiento.create({ ...data, usuario: usuarioId });
    },

    //Actualiza un entrenamiento, solo si pertenece al usuario autenticado
    async update(id: string, data: Partial<IEntrenamiento>, usuarioId: string): Promise<IEntrenamiento | null> {
        return await Entrenamiento.findOneAndUpdate({ _id: id, usuario: usuarioId }, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    },
    /*
        Partial se usa para permitir actualizar unicamente los campos del documento que yo quiera, 
        y Promise se usa porque la operacion de MongoDB es asincrona y devuelve el resultado
    */

    //Elimina un entrenamiento, solo si pertenece al usuario autenticado
    async delete(id: string, usuarioId: string): Promise<IEntrenamiento | null> {
        return await Entrenamiento.findOneAndDelete({ _id: id, usuario: usuarioId });
    },
};
