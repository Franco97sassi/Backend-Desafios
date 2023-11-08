import ProductServices from "../services/products.js";
import { validateAddProduct } from "../utils/index.js";
import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductsErrorInfo } from "../services/errors/info.js";
import logger from "../utils/logger.js";
import { templateDeletedProduct } from "../services/mailing/templates/templates.js";
import { sendMail } from "../services/mailing/mailing.js";

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
    let result = await productServices.getProducts(pageBody, limit, cat, sort);

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
    logger.error(error);
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
  res.send({ status: "success", product: product });
};

export const addProduct = async (req, res) => {
  let owner;
  let product = req.body;
  try {
    if (!validateAddProduct(product)) {
      CustomError.createError({
        name: "Error al añadir el producto",
        cause: generateProductsErrorInfo(product),
        message: "Error al intentar añadir el producto",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    if (req.user.role === "admin") {
      owner = "admin";
    } else if (req.user.role === "premium") {
      owner = req.user.email;
    } else {
      return res.status(403).send({
        status: "error",
        msg: `No tenes los permisos para realizar esta operación`,
      });
    }

    product.owner = owner;

    let result = await productServices.addProduct(product);
    return res.status(200).send({
      status: "success",
      msg: "Producto agregado exitosamente",
      pid: result._id,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      msg: `El código ${product.code} ya fue ingresado, por favor ingresa otro diferente`,
    });
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
    logger.error(error);
    throw error;
  }
};

export const deletedProduct = async (req, res) => {
  let pid = req.params.pid;
  let owner = req.user.role;
  let ownerEmail = req.user.email;

  try {
    let deletedProduct;
    let product = await productServices.getProductById(pid);
    if (owner === "admin") {
      deletedProduct = await productServices.deleteProduct(pid);
    } else if (owner === "premium") {
      if (product.owner === ownerEmail) {
        deletedProduct = await productServices.deleteProduct(pid);
      } else {
        return res.status(403).send({
          status: "error",
          msg: `El producto no fue creado por un usuario ${owner}, o el producto no existe`,
        });
      }
    }
    if (deletedProduct) {
      if (product.owner === "admin") {
        return res.send({
          status: "successful",
          msg: "Producto eliminado correctamente",
        });
      } else {
        const productName = product.title;
        const userEmail = product.owner;

        const options = templateDeletedProduct(userEmail, productName);
        await sendMail(options);

        return res.send({
          status: "successful",
          msg: "Producto eliminado correctamente",
        });
      }
    } else {
      return res.status(404).send({
        status: "error",
        msg: "El producto no existe o no se pudo eliminar",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: "error",
      msg: "Error al eliminar el producto",
      error: error,
    });
  }
};