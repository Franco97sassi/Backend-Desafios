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
import viewsRouter from "./src/routes/views.routes.js";
import sessionRouter from "./src/routes/session.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";
import config from "./src/config/config.js";
import errorHandler from "./src/middlewares/errors/index.js";
import { addLogger } from "./src/utils/logger.js";
import logger from "./src/utils/logger.js";
import usersRouter from "./src/routes/users.routes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { swaggerOptions } from "./src/utils/swagger-options.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import paymentsRouter from "./src/routes/payments.routes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// VARIABLES DE ENTORNO
const PORT = config.port;
const mongoURL = config.mongoUrl;
const sessionSecret = config.sessionSecret;
const baseURL = config.baseURL;

const app = express();
const specs = swaggerJSDoc(swaggerOptions);

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
// app.use(
//   session({
//     store: MongoStore.create({
//       mongoUrl: mongoURL,
//       mongoOptions: {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//       ttl: 250,
//     }),
//     secret: sessionSecret,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
app.use(cookieParser());
initializePassport();

app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/session", sessionRouter);
app.use("/api/users", usersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/", viewsRouter);
app.use(errorHandler);

const server = app.listen(PORT, () =>
  logger.info(`Corriendo en el puerto: ${server.address().port}`)
);

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  logger.error("Error de conexión:", error);
});

db.once("open", () => {
  logger.info("Conexión exitosa a la base de datos.");
});

const io = new Server(server);
const manager = new ProductManager();
const managerMsg = new MessagesManager();
const message = [];

io.on("connection", async (socket) => {
  const user = socket.request.user;

  logger.info("nuevo cliente conectado");
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

  socket.on("purchase", async (cid) => {
    try {
      const response = await fetch(`${baseURL}/api/cart/${cid}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });
      if (response.ok) {
        const data = await response.json();
        socket.emit("purchase-success", data);
      } else {
        logger.error("Error en la compra:", response.statusText);
        socket.emit("purchase-cancel");
      }
    } catch (error) {
      logger.error("Error:", error);
    }
  });
});

export default app;