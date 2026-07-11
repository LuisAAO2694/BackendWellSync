import { Habito, IHabito } from "../models/habito.model";

export const habitoService = {
    async getAll(): Promise<IHabito[]> {
        return await Habito.find();
    },

    async getById(id: string): Promise<IHabito | null> {
        return await Habito.findById(id);
    },

    async create(data: Partial<IHabito>): Promise<IHabito> {
        return await Habito.create(data);
    },

    async update(id: string, data: Partial<IHabito>): Promise<IHabito | null> {
        return await Habito.findByIdAndUpdate(id, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    }, //Aqui se usa un Partial y un Promise.
    /*
        Partial se usa para permitir actualizar unicamente los campos del documento que yo quiera, 
        y Promise se usa porque la operacion de MongoDB es asincrona y devuelve el resultado
    */

    async delete(id: string): Promise<IHabito | null> {
        return await Habito.findByIdAndDelete(id);
    }
};