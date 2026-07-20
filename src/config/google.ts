import {OAuth2Client} from 'google-auth-library';

//Aqui solo obtengo mi ID de google desde el .env
const clientId = process.env.GOOGLE_CLIENT_ID!;
//Creo una instancia del cliente para checar los tokens que vienen de google
const client = new OAuth2Client(clientId);

//Aqui solo creo una interfaz que define la info del user que se obtiene de google
export interface GoogleProfile {
    googleId: string;
    email: string;
    nombre: string;
    fotoPerfil?: string;
}

//En esta funcion solo checo que el token que vino desde google sea valido y me de la info del user
export async function verifyGoogleToken(idToken: string): Promise<GoogleProfile> {
    
    //Checa el token recibido utilizando el cliente
    const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
    });
    //Obtengo la info del token
    const payload = ticket.getPayload()!;

    //Me devuelve datso del usuarios 
    return {
        googleId: payload.sub,
        email: payload.email!,
        nombre: payload.name || payload.email!.split('@')[0], //Nombre o, si no existe, lo parto antes del @ del correo
        fotoPerfil: payload.picture,
    };
}