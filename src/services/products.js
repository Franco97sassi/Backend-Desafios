import ProductManager from "../DAO/productsDAO.js";

export default class ProductServices {
  constructor() {
    this.dao = new ProductManager();
  }

  async getProducts(pageBody, limit, cat, sort) {
    let products = await this.dao.getProducts(pageBody, limit, cat, sort);
    return products;
  }

  async getProductById(id) {
    let product = await this.dao.getProductById(id);
    return product;
  }

  async addProduct(product) {
    let result = await this.dao.addProduct(product);
    return result;
  }

  async updateProduct(pid, fields) {
    let result = await this.dao.updateProduct(pid, fields);
    return result;
  }

  async deleteProduct(pid) {
    let result = await this.dao.deleteProduct(pid);
    return result;
  }

  async getCategories() {
    let categories = await this.dao.getCategories();
    return categories;
  }
}