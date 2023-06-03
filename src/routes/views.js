import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const ViewRouter = Router();

let manager = new ProductManager;

ViewRouter.get("/", async (req, res)=>{
    const products = await manager.getProducts()
    res.render("index", { products, style:"style.css" })
})

ViewRouter.get("/realtimeProducts", (req, res) => {
    res.render("realTimeProducts", {style:"style.css"});
  });

export default ViewRouter;