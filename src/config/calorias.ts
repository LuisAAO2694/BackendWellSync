import axios from 'axios';

//Obtengo mis APIs del env
const apiKey = process.env.CALORIAS_API_KEY!;
const apiHost = process.env.CALORIAS_API_HOST!;

//Creo una instancia de Axios para consumir mi api
const client = axios.create({
    baseURL: `https://${apiHost}`,
    headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
    },
});

//Esta en si solo es una funcion generica para hacer las peticiones a la API
export async function fetchCalorias<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const response = await client.get(endpoint, { params });
    return response.data;
}
