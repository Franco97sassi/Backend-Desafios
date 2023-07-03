import { Router } from "express";
import ProductManager from "../DAO/ProductDao.js";
 
const ViewRouter = Router();

let manager = new ProductManager;
 
ViewRouter.get("/", async (req, res)=>{
    const products = await manager.getProducts()
    
         
    res.render("index", { products, style:"style.css" })
})

ViewRouter.get("/realtimeProducts", (req, res) => {
    res.render("realTimeProducts", {style:"style.css"});
  });

  ViewRouter.get("/chat", (req, res) => {
    res.render("chat", {style:"style.css"});
  });


export default ViewRouter;