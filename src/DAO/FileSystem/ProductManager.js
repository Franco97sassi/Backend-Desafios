import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "products.json";
  }

  getNextId() {
    return Date.now();
  }

  async getProducts() {
    const content = await fs.promises.readFile(this.path);
    const products = JSON.parse(content);
    return products;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id === parseInt(id));
    if (!product) {
      logger.info(`No se encontró ningún producto con el id: ${id}`);
    }
    return product;
  }

  async addProduct(product) {
    const genID = Date.now();
    try {
      const products = await this.getProducts();
      const existingProduct = products.find((p) => p.code === product.code);
      if (existingProduct) {
        return {
          error: "El código ya fue ingresado, por favor ingresa otro diferente",
        };
      }
      product.id = genID;
      product.status = true;
      products.push(product);

      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return { success: "Producto agregado exitosamente" };
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(pid, fields) {
    let product = null;
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id == pid);
      if (index == -1) {
        return product;
      }

      if (fields.title) products[index].title = fields.title;
      if (fields.description) products[index].description = fields.description;
      if (fields.price) products[index].price = fields.price;
      if (fields.thumbnails) products[index].thumbnails = fields.thumbnails;
      if (fields.code) products[index].code = fields.code;
      if (fields.stock) products[index].stock = fields.stock;
      if (fields.category) products[index].category = fields.category;
      if (fields.status) products[index].status = fields.status;

      product = { ...products[index] };
      await fs.writeFileSync(this.path, JSON.stringify(products));
      logger.info("product after:", products[index]);
    } catch (error) {
      throw error;
    }
    return product;
  }

  async deleteProduct(id) {
    try {
      let deletedProduct = null;
      const products = await this.getProducts();
      const index = products.findIndex(
        (product) => product.id === parseInt(id)
      );
      if (index == -1) {
        throw new Error(`No existe un producto con el ID: ${id}`);
      }

      deletedProduct = products.splice(index, 1)[0];
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }
}
export default ProductManager;
