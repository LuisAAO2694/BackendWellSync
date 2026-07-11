import { Entrenamiento, IEntrenamiento } from "../models/entrenamiento.model";

export const entrenamientoService = {

    //Obtengo todos los entrenamientos
    async getAll(): Promise<IEntrenamiento[]> {
        return await Entrenamiento.find();
    },

    //Busco por id el entrenamiento
    async getById(id: string): Promise<IEntrenamiento | null> {
        return await Entrenamiento.findById(id);
    },

    //Creo un entrenamiento
    async create(data: Partial<IEntrenamiento>): Promise<IEntrenamiento> {
        return await Entrenamiento.create(data);
    },

    //Actualizo por su id
    async update(id: string, data: Partial<IEntrenamiento>): Promise<IEntrenamiento | null> {
        return await Entrenamiento.findByIdAndUpdate(id, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    },
    /*
        Partial se usa para permitir actualizar unicamente los campos del documento que yo quiera, 
        y Promise se usa porque la operacion de MongoDB es asincrona y devuelve el resultado
    */

    //Elimino por su id
    async delete(id: string): Promise<IEntrenamiento | null> {
        return await Entrenamiento.findByIdAndDelete(id);
    },
};
