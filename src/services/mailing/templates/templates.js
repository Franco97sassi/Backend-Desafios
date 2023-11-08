import config from "../../../config/config.js";

const GMAIL_USER_AUTH = config.gmail_user_auth;
const baseUrl = config.baseURL;

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
            <a href="${baseUrl}/reset-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">Restablecer Contraseña</a>
            <p style="font-size: 16px; line-height: 1.5;">Si el botón de arriba no funciona, copia y pega la siguiente URL en tu navegador:</p>
            <p style="font-size: 16px; line-height: 1.5;"><a href="${baseUrl}/reset-password?token=${token}">${baseUrl}/reset-password?token=${token}</a></p>
            <p style="font-size: 16px; line-height: 1.5;">Gracias<br></p>
        </div>
    </body>
    </html>`,
  };
};

export const templateDeleteAccount = (to) => {
  return {
    from: GMAIL_USER_AUTH,
    to,
    subject: "Cuenta eliminada por inactividad",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cuenta Eliminada por Inactividad</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; text-align: center;">
        <div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #dc3545;">Cuenta Eliminada por Inactividad</h1>
            <p style="font-size: 16px; line-height: 1.5;">Lamentamos informarte que tu cuenta ha sido eliminada debido a inactividad.</p>
            <p style="font-size: 16px; line-height: 1.5;">Si crees que esto ha sido un error o deseas recuperar tu cuenta, por favor contáctanos.</p>
            <p style="font-size: 16px; line-height: 1.5;">Muchas Gracias.</p>
        </div>
    </body>
    </html>`,
  };
};

export const templateDeletedProduct = (to, productName) => {
  return {
    from: GMAIL_USER_AUTH,
    to,
    subject: "Producto Eliminado",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Producto Eliminado</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; text-align: center;">
        <div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #dc3545;">Producto Eliminado</h1>
          <p style="font-size: 16px; line-height: 1.5;">Lamentamos informarte que tu producto "${productName}" ha sido eliminado.</p>
          <p style="font-size: 16px; line-height: 1.5;">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
          <p style="font-size: 16px; line-height: 1.5;">Muchas Gracias.</p>
        </div>
      </body>
      </html>
    `,
  };
};