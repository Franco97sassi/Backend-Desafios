import express from 'express';
import ProductManager from './ProductManager.js';
const app=express();


const manager=new ProductManager();

app.use (express.urlencoded({extended:true}));
 
 
app.get('/products',async(req,res)=>{
    let productos=await manager.getProducts();
 let {limit}=req.query;
 let limitProducts=limit ? productos.slice(0,limit):productos;
 res.send(limitProducts);
})
 
app.get('/products/:id',async(req,res)=>{
     let productos=await manager.getProducts();
        let id=req.params.id;
        let idProducto=productos.find(producto=>producto.id==id);
        res.send(idProducto);
})

const server=app.listen(8080,()=>{
    console.log('Server running on port 8080');
})