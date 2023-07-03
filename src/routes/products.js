import { Router } from "express";
import ProductManager  from "../DAO/ProductDao.js"
import { validate } from "../utils/validate.js";

const ProductsRouter = Router();

const productManager = new ProductManager;

ProductsRouter.get("/", async(req, res)=>{
     let products;
     try{
        products=await  productManager.getProducts();
     }
        catch(err){
            res.status(400).send({ status: "error", msg: "Products not found" })
        }
        res.send({ status: "success", payload: products })
 

 }
);

ProductsRouter.get("/:pid", async (req, res)=>{
    let pid = req.params.pid;
    let product  ;
    try{
        product = await productManager.getProductById(pid);
    } 
    catch(err){
        res.status(400).send({ status: "error", msg: "Product not found" })
    }
    res.send({ status: "success", payload: product })
});

ProductsRouter.post("/", async (req, res)=>{
    let product = req.body;
    
      
    if(!product.title || !product.description|| !product.code || !product.category||
        !product.price || !product.stock 
        ){
        res.status(400).send({ status: "error", msg: "Invalid product details" })
    }
    try {
        await productManager.addProduct(product);
    }
    catch(err){
        res.status(400).send({ status: "error", msg: "Product cannot be added!" })
    }
     
    res.send({ status: "success", payload: product})
});

ProductsRouter.put("/:pid", async(req, res)=>{
    let pid = req.params.pid;
    let newProduct = req.body;
    let productUpdate = await manager.updateProduct(pid, newProduct);
     if(!product.name || !product.price || !product.description || !product.category || !product.image){
        res.status(400).send({ status: "error", msg: "Invalid product details" })
    }
    try   {
        await productManager.updateProduct(pid, newProduct);
    }
    catch(err){
        res.status(400).send({ status: "error", msg: "Product cannot be updated!" })
    }

    res.send({ status: "success", msg: "Updated Product"})
})

ProductsRouter.delete("/:pid", async(req, res)=>{
    let pid = req.params.pid;
    let productDelete;
    try{
        productDelete = await productManager.deleteProduct(pid);
    }
    catch(err){
        res.status(400).send({ status: "error", msg: "Product cannot be deleted!" })
    }
    res.send({ status: "success", msg: "Deleted Product"})
})
export default ProductsRouter;