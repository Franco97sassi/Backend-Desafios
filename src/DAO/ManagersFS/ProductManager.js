
import fs from 'fs'

class ProductManager {
    constructor() {
        this.path = 'products.json'
    }

    async generateId(){
        let products = await this.getProducts()
        return products.length + 1
    }

    async addProduct(product){
        let products = await this.getProducts()
        let id = await this.generateId()
        let producto = { id, ...product, status: true };
        products.push(producto)
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }
    
    async getProducts(){
        let data = await fs.promises.readFile(this.path)
        let products = JSON.parse(data)
        return products
    }

    async getProductByid(id){
        let products = await this.getProducts()
        let idProduct = products.find(product => product.id == id);
        return idProduct
    }

    async updateProduct(id, product){
        let products = await this.getProducts()
        let indice = products.findIndex(product => product.id == id)
            if (indice !== -1) {
                products[indice].title = product.title
                products[indice].description = product.description
                products[indice].price = product.price
                products[indice].code = product.code
                products[indice].stock = product.stock
            } else{
                return null;
            }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return product;
    }

    async deleteProduct(id){
        let products = await this.getProducts()
        let indice = products.findIndex(product => product.id == id)
        if (indice !== -1) {
            products.splice(indice, 1)
        } else {
            return null;
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return products;
    }

}

export default ProductManager;