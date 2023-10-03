import ProductServices from "../services/products.js";
import CartServices from "../services/cart.js";
import UserServices from "../services/session.js";
import TicketServices from "../services/ticket.js"
import {generateproducts} from "../mocks/products.js"
import logger from "../utils/logger.js"

const productServices = new ProductServices();
const cartServices = new CartServices();
const userServices = new UserServices();
const ticketServices = new TicketServices();

export const getProducts = async (req, res) => {
  try {
    let result = await productServices.getProducts();
    res.render("index", { products: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getChat = (req, res) => {
  res.render("chat", {});
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
    res.render("realtimeproducts", data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getProductsViews = async (req, res) => {
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

    let user = await userServices.getByEmail(req.session.user.email);
    let role = req.session.user.role;
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
      role: role,
    };

    res.render("products", data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getCart = async (req, res) => {
  const cid = req.params.cid;
  let cart;
  try {
    cart = await cartServices.getCart(cid);

    res.render("cart", cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};
export const login = async (req, res) => {
  if (req.session.user) {
    res.redirect("/products");
  } else {
    res.render("login", {});
  }
};

export const register = async (req, res) => {
  if (req.session.user) {
    res.redirect("/products");
  }
  res.render("register", {});
};

export const profile = async (req, res) => {
  let user = await userServices.getByEmail(req.session.user.email);
  res.render("profile", user);
};

export const logout = (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
};

export const failRegister = async (req, res) => {
  res.render("register-error", {});
};

export const failLogin = async (req, res) => {
  res.render("login-error", {});
};
export const getTicketByOrder=async(req,res)=>{
  const orderCode=req.params.tcode;
  let ticket
  try {
    ticket=await ticketServices.getTicketByOrder(orderCode)
    res.send(ticket)
  } catch (error) {
    res.status(500).send("error interno del servidor")
  }
}
export const getProductsMocks=async(req,res)=>{
  try {
    const product = await generateproducts(100)
    res.send(products)
  } catch (error) {
    logger.error(error);
  }
}

export const loggerTest=async(req,res)=>{
  req.logger.fatal("Testeo de error:fatal");
  req.logger.error("Testeo de error:error");
  req.logger.warning("Testeo de error: warning");
  req.logger.info("Testeo de error: info");
  req.logger.http("Testeo de error: http");
  req.logger.debug("Testeo de error :debug");
  res.send("Test de logger ejecutado")


}