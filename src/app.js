import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./Managers/ProductManager.js";
import ProductsRouter from "./routes/products.js";
import CartRouter from "./routes/cart.js";
import ViewRouter from "./routes/views.js";

const app = express();

const Httpserver = app.listen(8080, ()=>{
    console.log("Server Runing on port 8080");
})

const io = new Server(Httpserver)

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

    socket.on("deleted-product", async (id)=>{
      let deleted = await manager.deleteProduct(parseInt(id))
    })  
})

