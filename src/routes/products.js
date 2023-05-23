import {Router} from 'express';
import ProductManager from  '../datos/productManager.js';
 import { validateProduct}from '../utils/index.js';
const productRouter = Router();
 
 
let manager=new ProductManager();

//punto1

productRouter.get('/',async (req, res) => {
    let productos=await manager.getProducts();
    let {limit}=req.query;
    let limitProducts=limit ? productos.slice(0,limit):productos;
    res.send(limitProducts)
})
productRouter.get('/:pid' ,async(req,res)=>{
    let pid =req.params.id;
    let producto =await manager.getProductsById(pid);
 if(!producto){
    res.status(400).send( {status:'error',message:  `no existe el producto con ese id: ${pid}`})
 }
//    producto.id=productsManager.getNextId();
//   producto.status=true;
 
         res.send(producto)
 })

 productRouter.post('/',async(req,res)=>{
    let producto=req.body;
    producto.status=true;
    producto.id=await manager.generateId();

     if(!validateProduct(producto)){
       res.status(400).send({status:'error',message:'invalid product'});
     }
        await manager.addProduct(producto);
       res.send({status:"success",msg:"producto agregado"  })
 })
 productRouter.put('/:pid',async(req,res)=>{
    let pid=req.params.id;
    let fields=req.body;
    let updateProduct= await manager.updateProducts(pid,fields)
 if(!updateProduct){
    res.status(400).send({status:'error',message:'no existe el producto con ese id  '})
 } 
 res.send({status:"success",msg: `product ${updateProduct.id}updated `   })
 })

 productRouter.delete('/:pid',async(req,res)=>{
    let pid=req.params.id;
    let deleteProduct= await manager.deleteProduct(pid) 
    if(!deleteProduct){
        res.status(400).send({status:'error',message:'no existe el producto con ese id  '})
        }
        res.send({status:"success",msg: `product ${deleteProduct.id}deleted `   })
    } )
 
  

export default productRouter;