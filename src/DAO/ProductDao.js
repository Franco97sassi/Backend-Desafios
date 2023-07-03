import { productsModel } from "./models/products.model.js";
class ProductManager {
    constructor() {
        this.model = productsModel;
    }
    // async generateId(){
    //     let products = await this.getProducts()
    //     return products.length + 1
    // }
    async getProducts(){
        let products;
        try {
            products = await this.model.find();
        }
        catch (error) {
            console.log(error);
        }
        let productos= products.map(product => {
            return {
                 title: product.title,
                 description: product.description,
                 code: product.code,
                 category: product.category,

                price: product.price,
                // thumbnail: product.thumbnail,
                 stock: product.stock,
             } 
        })

        return productos;
    }

    async addProduct(product){
        let productCreated;
        try {
            productCreated = await this.model.create(product);
        }
        catch (error) {
            console.log(error);
        }
        return productCreated;

}
     async getProductsById(id){
        let productGet ;
        try {
            productGet = await this.model.findOne({_id:id});
            
        }
        catch (error) {
            console.log(error);
        }
        return productGet;


}
async updateProduct(pid, product){
    let productUpdated;
    try {
        productUpdated = await productsModel.updateOne({_id:pid},properties);
        
    }
    catch (error) {
        console.log(error);
    }
    return productUpdated;
}
}
export default ProductManager;