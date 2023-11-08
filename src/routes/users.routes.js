import { Router } from "express";
import {
  changeRole,
  deleteAccounts,
  getUsers,
  updateDocuments,
  deleteUser,
} from "../controllers/users.js";
import upload from "../config/multerConfig.js";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.delete("/", deleteAccounts);
usersRouter.delete("/:uid", deleteUser);
usersRouter.get("/premium/:uid", changeRole);
usersRouter.post("/:uid/documents", upload.any(), updateDocuments);

export default usersRouter;