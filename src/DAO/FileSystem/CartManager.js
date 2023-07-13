import fs from "fs";

class CartManager {
  constructor() {
    this.path = "src/cart.json";
  }

  getNextId() {
    return Date.now();
  }

  async getCarts() {
    let carts;
    try {
      let contenido = await fs.promises.readFile(this.path);
      carts = JSON.parse(contenido);
    } catch (error) {
      throw error;
    }
    return carts;
  }

  async getCart(id) {
    let carts = await this.getCarts();
    let cart = carts.find((c) => c.id == id);
    return cart;
  }

  async addProductToCart(pid, cid, quantity = 1) {
    let cart = null;
    let carts = await this.getCarts();
    let index = carts.findIndex((cart) => cart.id == cid);
    if (index == -1) {
      return cart;
    }
    let cartProducts = carts[index].products;
    let productIndex = cartProducts.findIndex((product) => product.id == pid);
    if (productIndex == -1) {
      // el producto no existe en el carrito, lo agregamos con quantity = 1
      cartProducts.push({ id: pid, quantity: quantity });
    } else {
      // el producto ya existe en el carrito, actualizamos la quantity
      cartProducts[productIndex].quantity += quantity;
    }
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      throw error;
    }
    return carts[index];
  }

  async createCart() {
    let newCart = {
      id: this.getNextId(),
      products: [],
    };
    let carts = await this.getCarts();
    carts.push(newCart);
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      throw error;
    }
    return newCart;
  }
}

export default CartManager;
