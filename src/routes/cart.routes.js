import { Router } from "express";
import {
  getCart,
  getCarts,
  addProductToCart,
  createCart,
  updateCart,
  updateProductQuantity,
  deleteProductFromCart,
  deleteAllProducts,purchase,
} from "../controllers/cart.js";
import { isUser } from "../middlewares/auth.js";
const cartRouter = Router();

cartRouter.get("/:cid", getCart);
cartRouter.get("/", getCarts);
cartRouter.post("/:cid/product/:pid",isUser, addProductToCart);
cartRouter.post("/", createCart);
cartRouter.put("/:cid", updateCart);
cartRouter.put("/:cid/products/:pid", updateProductQuantity);
cartRouter.delete("/:cid/products/:pid", deleteProductFromCart);
cartRouter.delete("/:cid", deleteAllProducts);
cartRouter.post("/:cid/purchase",purchase)

export default cartRouter;