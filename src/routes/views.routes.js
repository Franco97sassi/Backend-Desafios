import { Router } from "express";
import ProductManager from "../DAO/productsDAO.js";
import CartManager from "../DAO/cartsDAO.js";
import  session from "passport";
import sessionsRouter from "./session.routes.js";
const viewsRouter = Router();
const manager = new ProductManager();
const managerCart = new CartManager();

// viewsRouter.get("/", async (req, res) => {
//   try {
//     let result = await manager.getProducts();
//     res.render("index", { products: result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error interno del servidor");
//   }
// });

viewsRouter.get("/realtimeproducts", async (req, res) => {
  let pageBody = parseInt(req.query.page);
  if (!pageBody) pageBody = 1;
  try {
    let limit = req.query.limit;
    let result = await manager.getProducts(pageBody);
    const data = {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
    };
    res.render("realtimeproducts", data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

viewsRouter.get("/products", async (req, res) => {
  const pageBody = req.query.page || 1;
  const limit = req.query.limit || 10;
  const cat = req.query.category;
  const sort = req.query.sort || "asc";
  
  try {
    let categories = await manager.getCategories();
    categories = categories.map((category) => ({
      name: category,
      selected: category === cat,
    }));
    let result = await manager.getProducts(pageBody, limit, cat, sort);

    const data = {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      prevPage: result.prevPage,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage,
      page: result.page,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
      limit: limit,
      categories: categories,
      catSelected: cat,
      sort: sort,
    };

    res.render("products", data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;
  let cart;
  try {
    cart = await managerCart.getCart(cid);

    res.render("cart", cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});





viewsRouter.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/products");
     
  }else {
    res.render("login",{});
  }

  viewsRouter.post("/login", sessionsRouter);

  viewsRouter.get("/register", async (req, res) => {
     if (req.session.user) {
    res.redirect("/products");
     }
    res.render("register",{});
   }
  );

   viewsRouter.post("/register",sessionsRouter);

   viewsRouter.get("/failregister", async (req, res) => {
    res.render("register-error",{});
   })
   
    viewsRouter.get("/faillogin", async (req, res) => {
    res.render("login-error",{});
    })
    viewsRouter.get('/logout', async (req, res) => {
      req.session.destroy(error => {
        res.redirect('/login')
      });
        
    })
    viewsRouter.get('/failregister', async (req, res) => {
  res.render('register-error', {})
})
viewsRouter.get('/faillogin', async (req, res) => {
  res.render('login-error', {})
})
});


export default viewsRouter;