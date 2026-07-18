import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { JwtPayload } from '../middlewares/auth';

//Aqui vive la instancia singleton de socket.io, se inicializa en initSockets
let io: Server | null = null;

//Inicializa socket.io sobre el servidor HTTP ya creado en index.ts
export function initSockets(server: HttpServer): void {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
        },
    });

    //Middleware de autenticacion: valida el JWT que manda el cliente en el handshake
    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token || typeof token !== 'string') {
            next(new Error('Token no proporcionado'));
            return;
        }

        try {
            const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;
            socket.data.usuario = decoded;
            next();
        } catch {
            next(new Error('Token inválido o expirado'));
        }
    });

    //Cada socket se une a un room propio de su usuario, asi solo recibe lo suyo
    io.on('connection', (socket: Socket) => {
        const usuario = socket.data.usuario as JwtPayload;
        socket.join(`usuario:${usuario.id}`);
    });
}

//Emite un evento al room de un usuario especifico, si esta conectado
//No lanza si io no esta inicializado, para no tumbar llamadas desde servicios
export function emitirAUsuario(usuarioId: string, evento: string, payload: unknown): void {
    if (!io) return;
    io.to(`usuario:${usuarioId}`).emit(evento, payload);
}
