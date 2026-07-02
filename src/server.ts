import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function start() {
  await connectDB();

  const server = http.createServer(app);
  //pendiente: const io = new SocketIOServer(server, { ... });

  server.listen(env.port, () => {
    console.log(`[server] WellSync API escuchando en http://localhost:${env.port}`);
  });
}

start();
