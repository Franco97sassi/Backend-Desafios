
import fs from 'fs'

class CartManager {
    constructor() {
        this.path = 'cart.json'
    }

    async generateId(){
        let carts = await this.getCarts()
        return carts.length + 1
    }

    async getCarts(){
        let data = await fs.promises.readFile(this.path)
        let carts = JSON.parse(data)
        return carts;
    }

    async createCart(){
        let newCart = {
            id : await this.generateId(),
            products : []
        }
        let carts = await this.getCarts();
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return newCart;
    }

    async getProductsOfCart(id){
        let carts = await this.getCarts();
        let idCart = carts.find(cart => cart.id == id);
        return idCart;
    }

    async AddProductToCart(cid, pid){
        let cart;
        let carts = await this.getCarts();
        let index = carts.findIndex(cart => cart.id == cid);
        if (index === -1) {
            return cart;
        }
        let product = {
            id : parseInt(pid),
            quantity: 1
        }
        let cartProducts = carts[index].products;
        let ProductExist = cartProducts.find(cartProduct => cartProduct.id == product.id);
        if (ProductExist) {
            ProductExist.quantity++;
        } else {
            cartProducts.push(product);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return carts[index];
    }
    

}

export default CartManager;