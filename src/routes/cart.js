import { Router } from "express";
import CartManager from "../DAO/CartDao.js"

const CartRouter = Router();

let manager = new CartManager;

CartRouter.post("/", async (req, res)=>{
    let newCart;
    try{
        newCart = await manager.createCart();
    }
    catch(err){
        res.status(400).send({ status: "error", msg: "Cart cannot be created!" })
    }
    res.send({ status: "success", msg: "Added Cart"})

});

CartRouter.get("/:cid", async (req, res)=>{
    let cid = req.params.cid;
    let product;
    try{
        product = await manager.getCartById(cid);
    }
    catch(err){
        res.status(400).send({ status: "error", msg: "Cart not found" })
    }
    res.send({ status: "success", payload: product })

});

CartRouter.post("/:cid/products/:pid", async(req, res)=>{
    let cid = req.params.cid;
    let pid = req.params.pid;
    let addProduct;
    try{
        addProduct = await manager.addProductToCart(cid, pid);
    }
    catch(err){
        res.status(400).send({ status: "error", msg: "Product cannot be added to cart!" })
    }
    res.send({ status: "success", msg: "Added Product to Cart"})
})


export default CartRouter;