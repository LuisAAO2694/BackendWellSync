import { RegistroDiario, IRegistroDiario } from "../models/registroDiario.model";

export const registroDiarioService = {

    //Obtengo todos los registros diarios
    async getAll(): Promise<IRegistroDiario[]> {
        return await RegistroDiario.find();
    },

    //Busco por id el registro diario
    async getById(id: string): Promise<IRegistroDiario | null> {
        return await RegistroDiario.findById(id);
    },

    //Creo un registro diario
    async create(data: Partial<IRegistroDiario>): Promise<IRegistroDiario> {
        return await RegistroDiario.create(data);
    },

    //Actualizo por su id
    async update(id: string, data: Partial<IRegistroDiario>): Promise<IRegistroDiario | null> {
        return await RegistroDiario.findByIdAndUpdate(id, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    },

    //Elimino por su id
    async delete(id: string): Promise<IRegistroDiario | null> {
        return await RegistroDiario.findByIdAndDelete(id);
    },
};
