import { config } from 'dotenv';
config();

import { createApp } from './app';
import { connectDB } from './config/db';

const port = process.env.PORT || 3000;

async function main() {
    await connectDB();

    const app = createApp();

    app.listen(port, () => {
        console.log('app is running in http://localhost:' + port);
    });
}

main();
