import config from "../../../config/config.js";

const GMAIL_USER_AUTH = config.gmail_user_auth;

export const templateForgotPassword = (to, token) => {
  return {
    from: GMAIL_USER_AUTH,
    to,
    subject: "Restablecimiento de constraseña",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecimiento de Contraseña</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; text-align: center;">
        <div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #007bff;">Restablecimiento de Contraseña</h1>
            <p style="font-size: 16px; line-height: 1.5;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no has solicitado esto, puedes ignorar este mensaje.</p>
            <p style="font-size: 16px; line-height: 1.5;">Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
            <a href="http://localhost:8080/reset-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">Restablecer Contraseña</a>
            <p style="font-size: 16px; line-height: 1.5;">Si el botón de arriba no funciona, copia y pega la siguiente URL en tu navegador:</p>
            <p style="font-size: 16px; line-height: 1.5;"><a href="http://localhost:8080/reset-password?token=${token}">http://localhost:8080/reset-password?token=${token}</a></p>
            <p style="font-size: 16px; line-height: 1.5;">Gracias<br></p>
        </div>
    </body>
    </html>`,
  };
};