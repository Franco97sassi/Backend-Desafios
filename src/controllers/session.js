import UserServices from "../services/session.js";
import logger from "../utils/logger.js";
import { createHash, isValidPassword } from "../utils/index.js";

const userServices = new UserServices();

export const register = async (req, res) => {
  res.redirect("/login");
};

export const login = async (req, res) => {
  if (!req.user) return res.render("login-error", {});
  req.session.user = { email: req.user.email };
  res.redirect("/products");
};

export const github = async (req, res) => {};

export const githubCallback = async (req, res) => {
  req.session.user = req.user;
  res.redirect("/products");
};

export const current = async (req, res) => {
  let user = req.session.user;
  let result;
  try {
    result = await userServices.getUser(user.email);
    if (!result) {
      return res.status(400).send({
        status: "error",
        error: "No se encuentra el usuario en la session",
      });
    }
    return res.send({ status: "success", payload: result });

  } catch (error) {
     logger.error(`${error}`);
    return res.status(400).send({
      status:"error",
      error:"No se encuentra el usuario en la session "
    })
  }
 };
 export const forgotPassword = async (req, res) => {
  let { email } = req.body;
  try {
    const user = await userServices.getUser(email);
    if (!user) {
      return res
        .status(400)
        .send({ error: "No se encontró una cuenta asociada a ese email" });
    }
    let result = userServices.sendEmailResetPassword(user.email);
    if (!result) {
      return res.status(400).send({
        error: "No pudo enviarse el correo de recupero de contraseña",
      });
    }
    return res.send({
      status: "success",
      msg: "Correo enviado satisfactoriamente",
    });
  } catch (error) {
    logger.error(`${error}`);
    return res.status(400).send({
      status: "error",
      error: "No hemos podido procesar la petiión",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  try {
    const user = await userServices.getUserByResetToken(token);

    if (!user) {
      return res.status(400).send({ error: "Token inválido o expirado" });
    }

    if (isValidPassword(user, newPassword)) {
      return res.status(400).send({
        error: "La nueva contraseña no puede ser igual a la anterior",
      });
    }
    user.password = await createHash(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    const result = await userServices.resetPassword(user._id, user);
    return res.send({
      status: "success",
      msg: "Contraseña restablecida correctamente",
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      error: "No hemos podido procesar la petiión",
    });
  }
};