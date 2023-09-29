 
import { Router } from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deletedProduct,
} from "../controllers/products.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductById);
productsRouter.post("/", addProduct);
productsRouter.put("/:pid", updateProduct);
productsRouter.delete("/:pid", deletedProduct);

export default productsRouter;