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
} from "../controllers/cart.js";

const cartRouter = Router();

cartRouter.get("/:cid", getCart);
cartRouter.get("/", getCarts);
cartRouter.post("/:cid/product/:pid", addProductToCart);
cartRouter.post("/", createCart);
cartRouter.put("/:cid", updateCart);
cartRouter.put("/:cid/products/:pid", updateProductQuantity);
cartRouter.delete("/:cid/products/:pid", deleteProductFromCart);
cartRouter.delete("/:cid", deleteAllProducts);

export default cartRouter;