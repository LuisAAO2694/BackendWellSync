import axios from 'axios';

//Obtengo mis APIs desde mi env
const apiKey = process.env.EXERCISEDB_API_KEY!;
const apiHost = process.env.EXERCISEDB_API_HOST!;

//Creo una instancia de Axios con la cinfiguracion para la api
const client = axios.create({
    baseURL: `https://${apiHost}`,
    headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
    },
});

//Esta en si solo es una funcion generica para hacer las peticiones a la API
export async function fetchExercisedb<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    
    //Peticion a mi endpoint indicado, junto con mis params
    const response = await client.get(endpoint, { params });
    return response.data;
}