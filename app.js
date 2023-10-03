import express from "express";
import handlebars from "express-handlebars";
import ifEqHelper from "./src/helpers/handlebars-helpers.js";
import { multiplyHelper, calculateTotal } from "./src/helpers/cartHelper.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import ProductManager from "./src/DAO/productsDAO.js";
import MessagesManager from "./src/DAO/messagesDAO.js";
import cartRouter from "./src/routes/cart.routes.js";
import productsRouter from "./src/routes/products.routes.js";
import chatRouter from "./src/routes/chat.routes.js";
import viewsRouter from "./src/routes/views.routes.js";
import sessionRouter from "./src/routes/session.routes.js";
import session from "express-session";
import MongoStore from 'connect-mongo';
import initializePassport from "./src/config/passport-config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./src/config/config.js"
import errorHandle from "./src/middlewares/errors/index.js"
import{addLogger} from "./src/utils/logger.js"
import logger from "./src/utils/logger.js"
 

 //variables de entorno
const PORT=config.port||8081
const MONGO_URL=config.mongoURL
const SECRET=config.secret
const app = express();
app.use(addLogger)
 
 
mongoose.connect(MONGO_URL)
.then(() => console.log("Conexión exitosa a la base de datos."))
    .catch((error) => console.error("Error de conexión:", error));   
// "mongodb+srv://ltaralli:coder1234@cluster0.k7b3exc.mongodb.net/ecommerce",
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(express.static("public"));
 
app.engine(
  "handlebars",
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      if_eq: ifEqHelper,
      multiply: multiplyHelper,
      calculateTotal: calculateTotal,
    },
  })
);
// initializePassport(passport);
initializePassport(passport);

app.use(session({
  store: MongoStore.create({
      mongoUrl:
   'mongodb+srv://francosassi97:Avenida1997@coderhouse.962imlr.mongodb.net/ecommerce',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      // ttl: 3600,
  }),
   
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session())
app.set("views", "./src/views");
app.set("view engine", "handlebars");

//ROUTES
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/session", sessionRouter);
app.use("/", viewsRouter);
app.use(errorHandle)
//Listen
const server = app.listen(PORT, () =>
  logger.info(`server running on port ${server.address().port}`)
);
 
// const db = mongoose.connection;

// db.on("error", (error) => {
//   console.error("Error de conexión:", error);
// });

// db.once("open", () => {
//   logger.log("Conexión exitosa a la base de datos.");
// });

const io = new Server(server);
const manager = new ProductManager();
const managerMsg = new MessagesManager();
const message = [];

io.on("connection", async (socket) => {
  logger.log("nuevo cliente conectado");
  const products = await manager.getProducts();
  io.emit("productList", products);
  
  socket.on("product", async (newProd) => {
    const resultAdd = await manager.addProduct(newProd);
    if (resultAdd.error) {
      socket.emit("productAddError", resultAdd.error);
    } else {
      const productsGet = await manager.getProducts();
      io.emit("productList", productsGet);
      socket.emit("productAddSuccess");
    }
  });

  socket.on("productDelete", async (delProduct) => {
    try {
      let pid = await manager.deleteProduct(delProduct);
      const products = await manager.getProducts();
      io.emit("productList", products);
    } catch (error) {
      socket.emit("productDeleteError", error.message);
    }
  });

  socket.on("messages", async (data) => {
    let msgSend;
    try {
      msgSend = await managerMsg.addMessage(data);
      message.unshift(data);
      io.emit("messageLogs", message);
    } catch (error) {
      throw error;
    }
  });
});

 