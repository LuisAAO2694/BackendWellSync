import { fetchCalorias } from '../config/calorias';

//Este es solo mi servicio encargado de conusltar la API
export const caloriaService = {
    ///Calcula las calorias quemadas segun la actividad realizada.
    async calcular(activity: string, weight?: string, duration?: string) {
        //Objeto que almacena los parametros
        const params: Record<string, string> = { activity };

        //Aqui se puede agregar el peso y la duracion si fueron proporcionados
        if (weight) params.weight = weight;
        if (duration) params.duration = duration;

        //Hago la consulta a la api
        return await fetchCalorias<Record<string, unknown>[]>('/v1/caloriesburned', params);
    },

    //Obtengo la lista de act disponibles en la api
    async listarActividades() {
        return await fetchCalorias<string[]>('/v1/caloriesburnedactivities');
    },
};
