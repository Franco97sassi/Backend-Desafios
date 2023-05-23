import express from 'express';
import productRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';

 const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/products",productRouter)
app.use("/api/carts",cartsRouter)


const server = app.listen(8080, () => { 
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
} );
server .on('error', error => console.log(`Error en servidor ${error}`));