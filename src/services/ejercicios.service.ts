import { fetchExercisedb } from '../config/exercisedb';

//Esto de aqui solo es para consultar la API de exercise db
export const ejercicioService = {

    //Aqui busco los ejercicios, checando que el nombre coincida con el texto que puso
    async buscar(query: string) {
        const result = await fetchExercisedb<{
            success: boolean;
            data: { exerciseId: string; name: string; imageUrl?: string }[];
        }>('/api/v1/exercises/search', { search: query });
        
        return result.data;
    },

    //Aqui obtengo la lista de los ejercicios aplicando los filtros que tengo 
    async listar(filtros: { name?: string; bodyParts?: string; equipments?: string; targetMuscles?: string; limit?: string }) {
        
        //Aqui pues solo consulto la api con los filtros que se selecciono
        const result = await fetchExercisedb<{
            success: boolean;
            meta: { total: number; hasNextPage: boolean; nextCursor?: string };
            data: any[];
        }>('/api/v1/exercises', filtros);

        return result;
    },

    //Y aqui solo me traigo la informacion de cada ejercicio con su id 
    async getPorId(exerciseId: string) {
        const result = await fetchExercisedb<{
            success: boolean;
            data: any;

        }>(`/api/v1/exercises/${exerciseId}`);

        return result.data;
    },
};