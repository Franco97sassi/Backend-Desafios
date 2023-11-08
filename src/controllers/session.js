import UserServices from "../services/session.js";
import logger from "../utils/logger.js";
import { createHash, isValidPassword } from "../utils/index.js";
import { generateToken } from "../utils/jwt.js";
import CartServices from "../services/cart.js";

const cartServ = new CartServices();
const userServices = new UserServices();

export const register = async (req, res) => {
  let user = req.body;
  try {
    let userFound = await userServices.getByEmail(user.email);

    if (userFound) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }
    user.password = createHash(user.password);
    let result = await userServices.createUser(user);

    if (!result) {
      return res.redirect("/failregister");
    }
    res.redirect("/login");
  } catch (error) {
    return res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  let user;
  try {
    user = await userServices.getByEmail(email);
    if (!user || !isValidPassword(user, password)) {
      return res.redirect("/faillogin");
    }
    if (!user.cart._id) {
      const cart = await cartServ.createCart();
      user.cart = cart;
      await user.save();
    }
    delete user.password;

    let updatedUser = await userServices.updateLastConnection(user.email);
    if (!updatedUser) {
      logger.error("No se pudo actualizar la última conexión");
    }
    const token = generateToken(user, "24h");
    res.cookie("authToken", token, { httpOnly: true });
    res.redirect("/products");
  } catch (error) {
    return res.status(500).send({ error: "Error al iniciar sesión" });
  }
};

export const github = async (req, res) => {};

export const githubCallback = async (req, res) => {
  const user = req.user;
  const token = generateToken(user, "24h");
  res.cookie("authToken", token, { httpOnly: true });
  res.redirect("/products");
};

export const current = async (req, res) => {
  let user = req.user;
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
      status: "error",
      error: "No se encuentra el usuario en la session",
    });
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