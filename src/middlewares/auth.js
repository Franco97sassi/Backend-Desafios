export const authMiddleware = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.render("login", { status: "failed" });
    }
  };
  
  export function isAdmin(req, res, next) {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).send({
        status: "error",
        error:
          "Tu usuario no cuenta con los provilegios para realizar la opreración",
      });
    }
  }
  
  export function isUser(req, res, next) {
    if (req.user.role === "user" || req.user.role === "premium") {
      next();
    } else {
      res.status(403).send({
        error:
          "Tu usuario no cuenta con los provilegios para realizar la opreración",
      });
    }
  }