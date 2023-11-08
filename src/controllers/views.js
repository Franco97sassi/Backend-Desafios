import ProductServices from "../services/products.js";
import CartServices from "../services/cart.js";
import UserServices from "../services/session.js";
import TicketServices from "../services/ticket.js";
import { generateproducts } from "../mocks/products.js";
import logger from "../utils/logger.js";
import config from "../config/config.js";
import PaymentServices from "../services/payments.js";
import jwt from "jsonwebtoken";

const PRIVATE_KEY = config.private_key_JWT;

const paymentServices = new PaymentServices();
const productServices = new ProductServices();
const cartServices = new CartServices();
const userServices = new UserServices();
const ticketServices = new TicketServices();

export const getProducts = async (req, res) => {
};

export const home = (req, res) => {
  res.redirect("/products");
};

export const getChat = (req, res) => {
  res.render("chat", { title: "Chat" });
};

export const getProductsRealTime = async (req, res) => {
  let pageBody = parseInt(req.query.page);
  if (!pageBody) pageBody = 1;
  try {
    let limit = req.query.limit;
    let result = await productServices.getProducts(pageBody);
    const data = {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
    };
    res.render("realtimeproducts", { data, title: "Real Time Products" });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getProductsViews = async (req, res) => {
  let user = req.user;
  const pageBody = req.query.page || 1;
  const limit = req.query.limit || 10;
  const cat = req.query.category;
  const sort = req.query.sort || "asc";
  try {
    let categories = await productServices.getCategories();
    categories = categories.map((category) => ({
      name: category,
      selected: category === cat,
    }));
    let result = await productServices.getProducts(pageBody, limit, cat, sort);
    const data = {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      prevPage: result.prevPage,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage,
      page: result.page,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
      limit: limit,
      categories: categories,
      catSelected: cat,
      sort: sort,
      user: user,
      cart: user.cart,
    };

    res.render("products", { data, title: "Productos" });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getCart = async (req, res) => {
  const cid = req.params.cid;
  let cart;
  try {
    cart = await cartServices.getCart(cid);

    res.render("cart", { cart, title: "Carrito" });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const login = async (req, res) => {
  const token = req.cookies.authToken;
  if (token) {
    try {
      const user = jwt.verify(token, PRIVATE_KEY);
      if (user.email) {
        return res.redirect("/products");
      }
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  res.render("login", { title: "Login" });
};

export const register = async (req, res) => {
  const token = req.cookies.authToken;
  if (token) {
    try {
      const user = jwt.verify(token, PRIVATE_KEY);
      if (user.email) {
        return res.redirect("/products");
      }
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }

  res.render("register", { title: "Registro" });
};

export const profile = async (req, res) => {
  let user = await userServices.getUser(req.user.email);
  res.render("profile", { user, title: "Perfil" });
};

export const logout = (req, res) => {
  res.clearCookie("authToken"); // Elimina la cookie que contiene el token
  res.redirect("/login"); // Redirige a la página de inicio de sesión
};

export const failRegister = async (req, res) => {
  res.render("register-error", { title: "Error de registro" });
};

export const failLogin = async (req, res) => {
  res.render("login-error", { title: "Error de logeo" });
};

export const getTicketByOrder = async (req, res) => {
  const orderCode = req.params.tcode;
  let ticket;
  try {
    ticket = await ticketServices.getTicketByOrder(orderCode);

    res.send(ticket);
  } catch (error) {
    logger.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getProductsMocks = async (req, res) => {
  try {
    const products = await generateproducts(100);
    res.send(products);
  } catch (error) {
    logger.error(error);
  }
};

export const loggerTest = async (req, res) => {
  req.logger.fatal("Testeo de error: fatal");
  req.logger.error("Testeo de error: error");
  req.logger.warning("Testeo de error: warning");
  req.logger.info("Testeo de error: info");
  req.logger.http("Testeo de error: http");
  req.logger.debug("Testeo de error: debug");
  res.send("Test de Logger Ejecutado");
};

export const forgotPass = async (req, res) => {
  res.render("forgot-password", { title: "Recuperar Contraseña" });
};

export const resetPass = async (req, res) => {
  res.render("reset-password", { title: "Cambio de contraseña" });
};

export const paymentsSuccess = async (req, res) => {
  res.render("success-payments", { title: "Pago satisfactorio" });
};

export const paymentsCancel = async (req, res) => {
  res.render("cancel-payments", { tilte: "Pago cancelado" });
};

export const uploadDocuments = (req, res) => {
  const uid = req.user.id;
  res.render("update-documents", { uid, title: "Carga de documentación" });
};

export const getUsers = async (req, res) => {
  try {
    let users = await userServices.getAll();
    users = await Promise.all(
      users.map(async (user) => {
        user.isEligibleForRoleChange = await userServices.checkDocuments(
          user._id
        );
        return user;
      })
    );

    res.render("users", { users, title: "Gestión de usuarios" });
  } catch (error) {
    logger.error(error);
    res.status(500).send("Error interno del servidor");
  }
};