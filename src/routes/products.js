import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";
import { validate } from "../utils/validate.js";

const ProductsRouter = Router();

let manager = new ProductManager;

ProductsRouter.get("/", async(req, res)=>{
    let products = await manager.getProducts()
    let { limit } = req.query;
    let limitProducts = limit ? products.slice(0, limit) : products
    res.send(limitProducts)
});

ProductsRouter.get("/:pid", async (req, res)=>{
    let pid = req.params.pid;
    let product = await manager.getProductByid(pid);
    if(!product){
        res.status(400).send({ status: "error", msg: "Product not found" })
    }
    res.send(product)
});

ProductsRouter.post("/", async (req, res)=>{
    let product = req.body;
    product.id = await manager.generateId();
    product.status = true
    if(!validate(product)){
        res.status(400).send({ status: "error", msg: "Invalid Product" })
    }
    await manager.addProduct(product);
    res.send({ status: "success", msg: "Added Product"})
});

ProductsRouter.put("/:pid", async(req, res)=>{
    let pid = req.params.pid;
    let newProduct = req.body;
    let productUpdate = await manager.updateProduct(pid, newProduct);
    if (!productUpdate) {
        res.status(400).send({ status: "error", msg: "Product cannot be updated!" })
    }
    res.send({ status: "success", msg: "Updated Product"})
})

ProductsRouter.delete("/:pid", async(req, res)=>{
    let pid = req.params.pid;
    let productDelete = await manager.deleteProduct(pid);
    if (!productDelete) {
        res.status(400).send({ status: "error", msg: "Product cannot be deleted!" })
    }
    res.send({ status: "success", msg: "Product deleted"})
})
export default ProductsRouter;