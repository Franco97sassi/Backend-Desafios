import Stripe from "stripe";
import config from "../config/config.js";
import CartServices from "./cart.js";
import TicketServices from "./ticket.js";

const key = config.backend_stripe_key;
const url = config.baseURL;

const cartServices = new CartServices();
const ticketServices = new TicketServices();

export default class PaymentServices {
  constructor() {
    this.stripe = new Stripe(key);
  }

  createCheckout = async (cid) => {
    try {
      const { productsToPurchase, productsNotPurchase } =
        await cartServices.verifyPurchase(cid);

      if (productsToPurchase.length === 0) {
        return res.status(400).json({
          status: "error",
          message: productsToPurchase.message,
        });
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: productsToPurchase.map((cartItem) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: cartItem.title,
            },
            unit_amount: cartItem.price * 100,
          },
          quantity: cartItem.quantity,
        })),
        payment_intent_data: {},
        success_url: `${url}/api/cart/${cid}/purchase/success`,
        cancel_url: `${url}/api/cart/${cid}/purchase/cancel`,
      });

      return session;
    } catch (error) {
      logger.error("Error al crear el intento de pago:", error);
      throw error;
    }
  };

  processPurchase = async (cid, uid) => {
    try {
      const { productsToPurchase, productsNotPurchase } =
        await cartServices.verifyPurchase(cid);

      if (productsToPurchase.length === 0) {
        return res.status(400).json({
          status: "error",
          message: productsToPurchase.message,
        });
      }

      const resultPurchase = await cartServices.processPurchase(
        productsToPurchase
      );

      const ticket = await ticketServices.createTicket(productsToPurchase, uid);

      // AGREGAR VALIDACIONES

      const resultUpdateCart = await cartServices.updateCart(
        cid,
        productsNotPurchase
      );

      return {
        payload: ticket,
        newCart: resultUpdateCart,
        productsNotPurchase: productsNotPurchase,
      };
    } catch (error) {
      return res
        .status(500)
        .send({ message: `Error en el proceso de compra. ${error}` });
    }
  };
}