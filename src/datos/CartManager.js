import fs from 'fs';

class CartManager {
    constructor() {
        this.path = "carts.json"

    }

    async generateId(){
        let carts = await this.getProducts()
        return    carts.length + 1
    }
    async addProductToCart(product) {
        let carts = await this.getProducts();
        carts.push(product);
        console.log("se agrego el producto");
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))

    }

    async getCarts() {
        let data = await fs.promises.readFile(this.path)
        let products = JSON.parse(data)
        return products;
    }
    
    async createCart() {    
        let newCart= {
            id: await this.generateId(),
            products: [],
        }
        let carts = await this.getCarts();
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t")) 
        return newCart;
          
    }



    async getProductsOfCart(id) {
        let products = await this.getProducts();
        let idProduct = products.find(product => product.id == id)
        if (!idProduct) {
            console.log("No se encontro el producto")
        } else {
            return  idProduct;
        }
    }
 
}

export default CartManager;