import { Router } from "express";
import CartManager from "../Managers/CartManager.js";

const CartRouter = Router();

let manager = new CartManager;

CartRouter.post("/", async (req, res)=>{
    let newCart = await manager.createCart();
    if (!newCart) {
        res.status(400).send({ status: "error", msg: "" })
    }
    res.send({ status: "success", msg: "Cart created!"})
});

CartRouter.get("/:cid", async (req, res)=>{
    let cid = req.params.cid;
    let productOfCart = await manager.getProductsOfCart(cid);
    if(!productOfCart){
        res.status(404).send({ status: "error", msg: "Product not found" })
    }
    res.send(productOfCart)
});

CartRouter.post("/:cid/products/:pid", async(req, res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;
    let addProduct = await manager.AddProductToCart(cid, pid)
    if (!addProduct) {
        res.status(404).send({ status: "error", msg: "Product not added" })
    }
    res.send({ status: "success", msg: "Added Product"})
})


export default CartRouter;