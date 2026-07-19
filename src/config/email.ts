import nodemailer from 'nodemailer';

//Aqui creo y configuro el transporte para poder enviar los correos por medio de SMTP
export const transporter = nodemailer.createTransport({
    //Servidor SMTP que uso para enviar los correos
    host: process.env.SMTP_HOST,

    //Puerto del servidor
    port: Number(process.env.SMTP_PORT),

    //En si esto indica si la conxion usa ssl
    secure: false,

    //Las credenciales para autenticarse en el servidor SMTP
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const emailConfig = {
    //Direccion de correo desde la que se envian los correos
    from: process.env.EMAIL_FROM,
};
