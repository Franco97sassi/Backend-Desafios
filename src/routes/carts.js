import {Router} from 'express';
import CartManager from  '../datos/cartManager.js';
const cartsRouter = Router();

 
let manager= new CartManager();

 
cartsRouter.post('/',async(req,res)=>{
    let newCart=await manager.createCart();
       if (!newCart){
           res.status(400).send({status:'error',message:'invalid cart'});
       }
       res.send({status:"success",msg:"cart agregado"  })
 })

 cartsRouter.get('/:cid' ,async(req,res)=>{
    let cid =req.params.cid;
    let productoOfCart =await manager.getProductsById(cid);
 if(!productoOfCart){
    res.status(400).send( {status:'error',message:  `no existe el producto con ese id: ${pid}`})
 }
          res.send(producto)
 })

    cartsRouter.post('/:cid/products/:pid',async(req,res)=>{
         let cid=req.params.cid;
            let pid=req.params.pid;
            let addProduct= await manager.addProductToCart(cid,pid)
            if(!addProduct){
                res.status(400).send({status:'error',message:'no existe el producto con ese id  '})
            }
            res.send  ({status:"success",msg: `product ${addProduct.id}added `   })
    
    })



export default cartsRouter;