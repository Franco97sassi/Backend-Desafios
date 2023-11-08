import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  github,
  githubCallback,
  current,
  forgotPassword,
  resetPassword,
} from "../controllers/session.js";
import { auth } from "../utils/jwt.js";

const sessionRouter = Router();

sessionRouter.post("/register", register);

sessionRouter.post("/login", login);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  github
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  githubCallback
);

sessionRouter.get("/current", auth, current);
sessionRouter.post("/forgot-password", forgotPassword);
sessionRouter.post("/reset-password", resetPassword);

export default sessionRouter;