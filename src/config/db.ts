import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('[db] MongoDB conectado');
  } catch (error) {
    console.error('[db] Error al conectar a MongoDB:', (error as Error).message);
    process.exit(1);
  }
}
