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
        // if(!title|| !descripcion || !price || !thumbnail || !code || !stock){
        //     return console.log("Faltan datos")
        // }
        // if(this.products.some(elem=>elem.code==code)){
        //     return console.log( `Codigo ${code} repetido` )
        // }
        // this.products.push(product);
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
            return console.log(idProduct);
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


//Testing

const manager = new ProductManager()

// let arregloVacio = await manager.getProducts()
// console.log(arregloVacio);


let product1 = {
    "id": await manager.generateId(),
    "title": "Ipad G22",
    "descripcion": "Tamaño de la pantalla: 6.5...",
    "price": 67000,
    "thumbnail": "https://i.imgur.com/EsxY88d.jpg",
    "code": 1234,
    "stock": 7
}

let product2 = {
    "id": await manager.generateId(),
    "title": "Tablet Samsung A8",
    "descripcion": "Sistema operativo: Android...",
    "price": 112000,
    "thumbnail": "https://i.imgur.com/365TQnk.jpg",
    "code": 5678,
    "stock": 10
}

  await manager.addProduct(product1)
 await manager.addProduct(product2)

// let productoAgregado = await manager.getProducts()
// console.log(productoAgregado);

// let buscarPorId = await manager.getProductsById(1)
// console.log(buscarPorId);
// let buscarPorId2 = await manager.getProductsById(3)
// console.log(buscarPorId2);


// let productoActualizado = await manager.updateProducts(1, product1)
// console.log(productoActualizado);


// let productoEliminado = await manager.deleteProducts(1)
// console.log(productoEliminado);