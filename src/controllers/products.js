import ProductServices from "../services/products.js";
import { validateAddProduct } from "../utils/index.js";

const productServices = new ProductServices();

export const getProducts = async (req, res) => {
  const pageBody = req.query.page || 1;
  const limit = req.query.limit || 10;
  const cat = req.query.category;
  const sort = req.query.sort || "asc";
  try {
    let categories = await productServices.getCategories();
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
    };
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getProductById = async (req, res) => {
  let pid = req.params.pid;
  let product = await productServices.getProductById(pid);
  if (!product) {
    return res
      .status(400)
      .send({ status: "error", error: "Producto inexistente" });
  }
  res.send(product);
};

export const addProduct = async (req, res) => {
  let product = req.body;
  if (!validateAddProduct(product)) {
    res
      .status(400)
      .send({ status: "error", msg: "Por favor, completá todos los datos" });
  } else {
    try {
      await productServices.addProduct(product);
      res
        .status(200)
        .send({ status: "success", msg: "Producto agregado exitosamente" });
    } catch (error) {
      res.status(400).send({
        status: "error",
        msg: `El código ${product.code} ya fue ingresado, por favor ingresa otro diferente`,
      });
    }
  }
};

export const updateProduct = async (req, res) => {
  let pid = req.params.pid;
  let fields = req.body;
  try {
    let updatedProduct = await productServices.updateProduct(pid, fields);
    if (!updatedProduct) {
      res.status(404).send({ status: "error", msg: "El producto no existe" });
    }
    res.send({
      status: "successful",
      msg: "Producto modificado correctamente",
    });
  } catch (error) {
    throw error;
  }
};

export const deletedProduct = async (req, res) => {
  const pid = req.params.pid;
  const deletedProduct = await productServices.deleteProduct(pid);
  if (!deletedProduct) {
    res.status(404).send({ status: "error", msg: "El producto no existe" });
  } else {
    res.send({ status: "successful", msg: "Producto eliminado correctamente" });
  }
};