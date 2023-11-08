import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deletedProduct,
} from "../controllers/products.js";
import { auth } from "../utils/jwt.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductById);
productsRouter.post("/", auth, addProduct);
productsRouter.put("/:pid", auth, updateProduct);
productsRouter.delete("/:pid", auth, deletedProduct);

export default productsRouter;