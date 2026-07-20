import 'dotenv/config';
import http from 'http';
import { createApp } from './app';
import { connectDB } from './config/db';
import { initSockets } from './sockets/sockets';

const port = process.env.PORT || 3000;

async function main() {
    await connectDB();

    const app = createApp();
    const server = http.createServer(app);

    initSockets(server);

    server.listen(port, () => {
        console.log('app is running in http://localhost:' + port);
    });
}

main();
