import { transporter, emailConfig } from '../config/email';

//Servicio  que se encarga del envio del los mails
export const emailService = {
    //Envio un correo con el enlace para restablecer la contraseña
    async sendResetPasswordEmail(to: string, token: string): Promise<void> {
        //Url que utiliza el usuario para hacer el reset de la contraseña
        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

        //Envio el correo utilzando la configuracion del transporter
        await transporter.sendMail({
            //Correo del remitente
            from: emailConfig.from,
            //Correo del destinatario
            to,
            subject: 'Recuperación de contraseña - WellSync',
            html: `
                <h1>Recuperación de contraseña</h1>
                <p>Has solicitado restablecer tu contraseña.</p>
                <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
                    Restablecer contraseña
                </a>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste esto, ignora este correo.</p>
            `,
        });
    },
};
