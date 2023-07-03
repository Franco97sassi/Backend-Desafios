import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
// import ProductManager from "./Managers/ProductManager.js";
import ProductManager from "./DAO/ProductDao.js";
import ProductsRouter from "./routes/products.js";
import CartRouter from "./routes/cart.js";
import ViewRouter from "./routes/views.js";
import mongoose from "mongoose";

const app = express();
const Httpserver = app.listen(8080, ()=>{
    console.log("Server Runing on port 8080");
})

mongoose.connect("mongodb+srv://coderhouse:Avenida1997@coderhouse.962imlr.mongodb.net/ecommerce?retryWrites=true&w=majority")
.then(()=>{
  console.log("Conexion a la base de datos exitosa")
}
)
.catch((err)=>{
  console.log("Error en la conexion a la base de datos")
} 
)

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded( {extended: true} ))

app.use("/", ViewRouter)
app.use("/api/products", ProductsRouter)
app.use("/api/carts", CartRouter)

const manager = new ProductManager;
const io = new Server(Httpserver)

const mensajes=[]
 io.on("connection", async (socket) =>{
    console.log("New User conected!");

    const data = await manager.getProducts();
    if (data) {
      io.emit("resp-new-product", data);
    }

    socket.on("createProduct", async (data) => {
      console.log(data);
        const newProduct = await manager.addProduct(data);
      });

    socket.on("deleted-product", async (pid)=>{
      let productDeleted = await manager.deleteProduct(parseInt(pid))
    })  


socket.on("newUserLoged",data=>
{
  console.log(data)
  io.emit("newUser",data)
}
)


socket.on("message",data=>{
  console.log(`se recibio el mensaje ${data.message} del usuario ${data.user}`);
  mensajes.push(data)
  io.emit("messages",mensajes)
})
 })

 