 
import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  github,
  githubCallback,
  current,
} from "../controllers/session.js";

const sessionRouter = Router();

sessionRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  register
);

sessionRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  login
);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  github
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback
);

sessionRouter.get("/current", current);

export default sessionRouter;