//Bueno esta es una clase mas que todo para manejar errores dentro del back

export class AppError extends Error 
{
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    //Constructor que recibe el mensaje del error, desde http
    //y un indicador para saber si es un error operacional
    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}