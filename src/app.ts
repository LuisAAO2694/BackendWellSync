import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { specs } from './config/swagger';
import { errorHandler } from './middlewares/middlewares';

export function createApp() {
    const app = express();

    app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.use(routes);
    app.use(errorHandler);

    return app;
}
