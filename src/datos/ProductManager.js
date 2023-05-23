import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = "products.json"

    }

    async generateId(){
        let products = await this.getProducts()
        return    products.length + 1
    }
    async addProduct(product) {
        let products = await this.getProducts();
        products.push(product);
        console.log("se agrego el producto");
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))

    }

    async getProducts() {
        let data = await fs.promises.readFile(this.path)
        let products = JSON.parse(data)
        return products;
    }

    async getProductsById(id) {
        let products = await this.getProducts();
        let idProduct = products.find(product => product.id == id)
        if (!idProduct) {
            console.log("No se encontro el producto")
        } else {
            return  idProduct;
        }
    }

    async updateProducts(id, product) {
        let products = await this.getProducts();
        let indice = products.findIndex(product => product.id === id)
        if (indice !== -1) {
            products[indice].title = product.title;
             products[indice].descripcion = product.descripcion;
            products[indice].price = product.price;
              products[indice].code = product.code;
              products[indice].stock = product.stock;
              products[indice].category = product.code;
              products[indice].status = product.status;

        }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return console.log('Producto  actualizado')
    }

    async deleteProducts(id) {
        let products = await this.getProducts();
        let indice = products.find(product => product.id == id)
        if (indice !== -1) {
            products.splice(indice, 1)
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return console.log("Producto  borrado")

    }
}


export default ProductManager;