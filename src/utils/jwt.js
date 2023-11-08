import jwt from "jsonwebtoken";
import config from "../config/config.js";

const PRIVATE_KEY = config.private_key_JWT;

export const generateToken = (user, expiresIn) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      age: user.age,
      cart: user.cart,
    },
    PRIVATE_KEY,
    { expiresIn: expiresIn }
  );
  return token;
};

export const auth = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    req.user = jwt.verify(token, PRIVATE_KEY);
  } catch (error) {
    return res.status(403).json({
      error: "Token invalido",
      msg: "El token enviado no es valido o no tiene el nivel de acceso suficiente para este recurso.",
    });
  }

  next();
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) res.status(401).send({ error: "Unauthorized" });
    if (req.user.role != role)
      return res.status(403).send({ error: "Sin permisos" });
    next();
  };
};