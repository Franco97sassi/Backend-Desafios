import { Router } from "express";
import PaymentServices from "../services/payments.js";
import config from "../config/config.js";
import Stripe from "stripe";
import logger from "../utils/logger.js";
import TicketServices from "../services/ticket.js";
import CartServices from "../services/cart.js";

const stripe = new Stripe(config.backend_stripe_key);
 
const paymentsRouter = Router();

const paymentServices = new PaymentServices();
const cartServices = new CartServices();
const ticketServices = new TicketServices();

paymentsRouter.get("/checkout", async (req, res) => {
  const clientSecret = req.query.client_secret;
  res.render("checkout", { client_secret: clientSecret });
});

paymentsRouter.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookKEY);
  } catch (err) {
    logger.log(`Webhook Error: ${err.message}`);
    return res.sendStatus(400);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { cart_id, user_id, productsToPurchase, productsNotPurchase } =
      paymentIntent.metadata;

    const parsedProductsToPurchase = JSON.parse(productsToPurchase);
    const parsedProductsNotPurchase = JSON.parse(productsNotPurchase);

    const ticket = ticketServices.createTicket(
      user_id,
      parsedProductsToPurchase
    );
    const resultUpdateCart = cartServices.updateCart(
      cid,
      parsedProductsNotPurchase
    );
  }

  res.redirect(`cart/${cid}/${ticket.payload.code}`);
});

export default paymentsRouter;