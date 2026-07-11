import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
    const uri = process.env.MONGO_URI;
    if (!uri) 
        {
        console.error('No hay variable de entorno de la BD');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('Conectado a la BD correctamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB desconectado');
    });
    
}