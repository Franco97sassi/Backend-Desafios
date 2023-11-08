import CartServices from "../services/cart.js";
import ProductServices from "../services/products.js";
import TicketServices from "../services/ticket.js";
import PaymentServices from "../services/payments.js";
import Stripe from "stripe";
import config from "../config/config.js";
import { calculateTotalAmount } from "../utils/index.js";
import logger from "../utils/logger.js";

const stripe = new Stripe(config.backend_stripe_key);

const cartServices = new CartServices();
const productServices = new ProductServices();
const paymentServices = new PaymentServices();

export const getCart = async (req, res) => {
  const cid = req.params.cid;
  const uid = req.user;
  try {
    const cart = await cartServices.getCart(cid);

    if (!cart) {
      return res.status(404).send({
        status: "error",
        msg: "El carrito no existe",
      });
    }

    res.send({
      status: "successful",
      products: cart.products,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al obtener el carrito",
    });
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await cartServices.getCarts();
    res.send({ status: "successful", carts });
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al obtener los carritos",
    });
  }
};

export const addProductToCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const user = req.user.email;
  try {
    const product = await productServices.getProductById(pid);

    if (!product) {
      return res.status(404).send({
        status: "error",
        msg: "El producto no existe",
      });
    }

    if (product.owner === user && req.user.role === "premium") {
      return res.status(403).send({
        status: "error",
        msg: "No puedes agregar tu propio producto al carrito",
      });
    }

    if (req.user.role === "admin") {
      return res.status(403).send({
        status: "error",
        msg: "No puedes comprar siendo admin",
      });
    }

    if (product.stock <= 0) {
      return res.status(400).send({
        status: "error",
        msg: "No hay suficiente stock para este producto",
      });
    }

    const result = await cartServices.addProductToCart(pid, cid);

    if (!result.success) {
      return res.status(404).send({
        status: "error",
        msg: result.message,
      });
    }

    return res.send({
      status: "successful",
      msg: result.message,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al agregar el producto al carrito",
    });
  }
};

export const createCart = async (req, res) => {
  try {
    let cart = await cartServices.createCart();
    if (!cart) {
      return res
        .status(500)
        .send({ status: "error", msg: "No se pudo crear el carrito" });
    }
    res.send({
      status: "successful",
      cartId: cart._id,
      msg: "Carrito creado correctamente",
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProductFromCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const cart = await cartServices.getCart(cid);

    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", msg: "El carrito no existe" });
    }

    const updatedCart = await cartServices.deleteProductFromCart(pid, cid);

    if (!updatedCart.success) {
      return res
        .status(404)
        .send({ status: "error", msg: updatedCart.message });
    }

    return res.send({
      status: "successful",
      msg: "Producto eliminado del carrito correctamente",
      cart: updatedCart.cart,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({
      status: "error",
      msg: "Error al eliminar el producto del carrito",
    });
  }
};

export const updateCart = async (req, res) => {
  const cid = req.params.cid;
  const products = req.body.products;

  try {
    const cart = await cartServices.getCart(cid);

    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", msg: "El carrito no existe" });
    }

    const updatedCart = await cartServices.updateCart(cid, products);

    if (!updatedCart.success) {
      return res
        .status(404)
        .send({ status: "error", msg: updatedCart.message });
    }

    res.send({
      status: "successful",
      msg: "Carrito actualizado correctamente",
      cart: updatedCart.cart,
    });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .send({ status: "error", msg: "Error al actualizar el carrito" });
  }
};

export const updateProductQuantity = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;

  const updateResult = await cartServices.updateProductQuantity(
    cid,
    pid,
    quantity
  );

  if (!updateResult.success) {
    return res.status(404).send({
      status: "error",
      message: updateResult.message,
    });
  }

  res.send({
    status: "success",
    message: updateResult.message,
    cart: updateResult.cart,
  });
};

export const deleteAllProducts = async (req, res) => {
  const cid = req.params.cid;

  const deleteResult = await cartServices.deleteAllProducts(cid);

  if (!deleteResult.success) {
    return res.status(404).send({
      status: "error",
      message: deleteResult.message,
    });
  }

  res.send({
    status: "success",
    message: deleteResult.message,
  });
};

export const purchase = async (req, res) => {
  let intent;
  try {
    const cid = req.params.cid;
    const uid = req.user.email;
    let { productsToPurchase, productsNotPurchase } =
      await cartServices.verifyPurchase(cid);

    if (productsToPurchase.length === 0) {
      return res.status(400).send({
        status: "error",
        message: productsToPurchase.message,
      });
    }

    const resultPurchase = await cartServices.processPurchase(
      productsToPurchase
    );

    intent = await stripe.paymentIntents.create({
      amount: calculateTotalAmount(productsToPurchase) * 100,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        cart_id: cid,
        user_id: uid,
        productsToPurchase: JSON.stringify(productsToPurchase),
        productsNotPurchase: JSON.stringify(productsNotPurchase),
      },
    });

    return res.send({
      status: "success",
      client_secret: intent.client_secret,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Error en el proceso de compra. ${error}` });
  }
};

export const purchaseDEV = async (req, res) => {
  let cid;
  let url;
  try {
    cid = req.params.cid;
    const response = await paymentServices.createCheckout(cid);
    if (response) {
      url = response.url;
      res.status(200).json({ url });
    } else {
      res
        .status(400)
        .json({ status: "error", msg: "No hay productos disponibles" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "No se pudo procesar la compra",
      error: error,
    });
  }
};

export const purchaseDEVsuccess = async (req, res) => {
  try {
    const uEmail = req.user.email;
    const cid = req.params.cid;
    const result = await paymentServices.processPurchase(cid, uEmail);
    res.render("success-payments", result);
  } catch (error) {
    res.status(500).send({
      status: "error",
      msg: "No se pudo procesar el ticket",
      error: error,
    });
  }
};

export const unprocessPurchase = async (req, res) => {
  res.render("cancel-payments");
};