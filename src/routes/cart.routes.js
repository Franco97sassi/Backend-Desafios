import { Router } from "express";
import {
  getCart,
  getCarts,
  addProductToCart,
  createCart,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  deleteAllProducts,
  purchase,
  purchaseDEV,
  purchaseDEVsuccess,
  unprocessPurchase,
} from "../controllers/cart.js";
import { auth } from "../utils/jwt.js";

const cartRouter = Router();

cartRouter.get("/:cid", auth, getCart);
cartRouter.get("/", getCarts);
cartRouter.post("/:cid/product/:pid", auth, addProductToCart);
cartRouter.post("/", createCart);
cartRouter.put("/:cid", updateCart);
cartRouter.put("/:cid/product/:pid", updateProductQuantity);
cartRouter.delete("/:cid/product/:pid", deleteProductFromCart);
cartRouter.delete("/:cid", deleteAllProducts);
cartRouter.post("/:cid/purchase", purchaseDEV);
cartRouter.get("/:cid/purchase/success", auth, purchaseDEVsuccess);
cartRouter.get("/:cid/purchase/cancel", unprocessPurchase);

export default cartRouter;