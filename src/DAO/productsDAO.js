import { productsModel } from "../DAO/db/model/products.model.js";

class ProductManager {
  constructor() {
    this.model = productsModel;
  }

  async getProducts(pageBody, limit, cat, sort) {
    let products;
    const options = {
      page: pageBody,
      limit: limit,
      sort: { price: sort === "desc" ? -1 : 1 },
    };
    let query = {};

    if (cat) {
      query.category = cat;
    }

    const noFiltersProvided = !pageBody && !limit && !cat && !sort;

    try {
      if (noFiltersProvided) {
        products = await this.model.find();
      } else {
        products = await this.model.paginate(query, options);
      }
    } catch (error) {
      console.log(error);
    }

    return products;
  }

  async getProductById(id) {
    let product;
    try {
      product = await this.model.findOne({ _id: id });
      if (!product) {
        console.log(`No se encontró ningún producto con el id: ${id}`);
      }
    } catch (error) {
      console.log(error);
    }
    return product;
  }
  async addProduct(product) {
    let existingProduct;
    let producto;
    try {
      existingProduct = await this.model.findOne({ code: product.code });
      if (existingProduct) {
        return {
          error: `El codigo ${product.code} ya fue ingresado, por favor ingresa otro diferente`,
        };
      }
      producto = await this.model.create(product);
    } catch (error) {
      console.log(error);
    }
    return producto;
  }

  async updateProduct(pid, fields) {
    let product;
    try {
      product = await this.model.updateOne({ _id: pid }, fields);
    } catch (error) {
      console.log(error);
    }
    return product;
  }

  async deleteProduct(pid) {
    let deletedProduct;
    try {
      deletedProduct = await this.model.deleteOne({ _id: pid });
    } catch (error) {
      console.log(error);
    }
    return deletedProduct;
  }

  async getCategories() {
    try {
      const categories = await this.model.distinct("category");
      return categories;
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      throw error;
    }
  }

  async deleteProductFromCart(pid, cid) {
    try {
      const filter = { _id: cid };
      const update = {
        $pull: {
          products: { id: pid },
        },
      };

      const updatedCart = await this.model.updateOne(filter, update);

      if (updatedCart.modifiedCount === 0) {
        return {
          success: false,
          message: "Carrito no encontrado",
        };
      }

      const cart = await this.model.findById(cid);
      return {
        success: true,
        message: "Producto eliminado del carrito",
        cart,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error al eliminar el producto del carrito",
      };
    }
  }
}

export default ProductManager;