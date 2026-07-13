import { Logro, ILogro } from "../models/logro.model";

export const logroService = {

    //Obtengo todos los logros
    async getAll(): Promise<ILogro[]> {
        return await Logro.find();
    },

    //Busco por id el logro
    async getById(id: string): Promise<ILogro | null> {
        return await Logro.findById(id);
    },

    //Creo un logro
    async create(data: Partial<ILogro>): Promise<ILogro> {
        return await Logro.create(data);
    },

    //Actualizo por su id
    async update(id: string, data: Partial<ILogro>): Promise<ILogro | null> {
        return await Logro.findByIdAndUpdate(id, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    },

    //Elimino por su id
    async delete(id: string): Promise<ILogro | null> {
        return await Logro.findByIdAndDelete(id);
    },
};
