import UserServices from "../services/session.js";
const userServices = new UserServices();

export const register = async (req, res) => {
  res.redirect("/login");
};

export const login = async (req, res) => {
  if (!req.user) return res.render("login-error", {});
  req.session.user = { email: req.user.email };
  res.redirect("/products");
};

export const github = async (req, res) => {};

export const githubCallback = async (req, res) => {
  req.session.user = req.user;
  res.redirect("/products");
};

export const current = async (req, res) => {
  let user = req.session.user;
  let result;
  try {
    result = await userServices.getUser(user.email);
    if (!result) {
      return res.status(400).send({
        status: "error",
        error: "No se encuentra el usuario en la session",
      });
    }
  } catch (error) {
    console.log(error);
  }
  return res.send({ status: "success", payload: result });
};