import { Reporte, IReporte } from "../models/reporte.model";

export const reporteService = {

    //Obtengo todos los reportes
    async getAll(): Promise<IReporte[]> {
        return await Reporte.find();
    },

    //Busco por id el reporte
    async getById(id: string): Promise<IReporte | null> {
        return await Reporte.findById(id);
    },

    //Creo un reporte
    async create(data: Partial<IReporte>): Promise<IReporte> {
        return await Reporte.create(data);
    },

    //Actualizo por su id
    async update(id: string, data: Partial<IReporte>): Promise<IReporte | null> {
        return await Reporte.findByIdAndUpdate(id, data, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, //Ejecuta las validaciones definidas en el Schema
        });
    },

    //Elimino por su id
    async delete(id: string): Promise<IReporte | null> {
        return await Reporte.findByIdAndDelete(id);
    },
};
