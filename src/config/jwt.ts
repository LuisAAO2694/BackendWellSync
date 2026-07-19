import { SignOptions } from 'jsonwebtoken';

//Esta es solo la config para generar y validar los JWT
export const jwtConfig = {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN! as SignOptions['expiresIn'],
};
