 
import { Router } from "express";
import {
  getProducts,
  getChat,
  getProductsRealTime,
  getProductsViews,
  getCart,
  login,
  register,
  profile,
  logout,
  failRegister,
  failLogin,
  getTicketByOrder,
  getProductsMocks,
  loggerTest,forgotPass,
  resetPass,
} from "../controllers/views.js";
import { authMiddleware, isAdmin, isUser } from "../middlewares/auth.js";

const viewsRouter = Router();
const sessionRouter = Router();
 
viewsRouter.get("/", getProducts);
viewsRouter.get("/chat",authMiddleware,isUser, getChat);
viewsRouter.get("/realtimeproducts",authMiddleware,isAdmin, getProductsRealTime);
viewsRouter.get("/products", authMiddleware, getProductsViews);
viewsRouter.get("/carts/:cid", getCart);
viewsRouter.get("/carts/:cid/:tcode", getTicketByOrder);

viewsRouter.get("/login", login);
viewsRouter.post("/login", sessionRouter);
viewsRouter.get("/register", register);
viewsRouter.post("/register", sessionRouter);
viewsRouter.get("/profile", authMiddleware, profile);
viewsRouter.get("/logout", logout);
viewsRouter.get("/failregister", failRegister);
viewsRouter.get("/faillogin", failLogin);
viewsRouter.get("/mockingproducts", getProductsMocks);
viewsRouter.get("/loggerTest", loggerTest);
viewsRouter.get("/forgot-password", forgotPass);
viewsRouter.get("/reset-password", resetPass);

export default viewsRouter;