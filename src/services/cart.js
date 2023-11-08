import CartManager from "../DAO/cartsDAO.js";

export default class CartServices {
  constructor() {
    this.dao = new CartManager();
  }

  async getCarts() {
    let carts = await this.dao.getCarts();
    return carts;
  }

  async getCart(id) {
    let cart = await this.dao.getCart(id);
    return cart;
  }

  async addProductToCart(pid, cid) {
    let result = await this.dao.addProductToCart(pid, cid);
    return result;
  }

  async createCart() {
    let result = await this.dao.createCart();
    return result;
  }

  async deleteProductFromCart(pid, cid) {
    let result = await this.dao.deleteProductFromCart(pid, cid);
    return result;
  }

  async updateCart(cid, products) {
    let result = await this.dao.updateCart(cid, products);
    return result;
  }

  async updateProductQuantity(cid) {
    let result = await this.dao.updateProductQuantity(cid);
    return result;
  }

  async deleteAllProducts(cid) {
    let result = await this.dao.deleteAllProducts(cid);
    return result;
  }

  async verifyPurchase(cid) {
    let result = await this.dao.verifyPurchase(cid);
    return result;
  }

  async processPurchase(productsToPurchase) {
    let result = await this.dao.processPurchase(productsToPurchase);
    return result;
  }

  async unprocessedProducts(productsNotPurchase) {
    let result = await this.dao.unprocessedProducts(productsNotPurchase);
    return result;
  }
} 