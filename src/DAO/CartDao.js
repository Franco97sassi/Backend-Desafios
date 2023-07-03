import {cartModel} from './models/carts.model.js';
class CartManager{
    constructor(){
        this.model = cartModel;
    }
    async getCartByid( ){
        let cart;
        try {
            cart = await this.model.findOne({_id:id});
        }
        catch (error) {
            console.log(error);
        }
        return cart;
    }
    async createCart(){
        let cartCreated;
        let cart={products:[]}
        try {
            cartCreated = await this.model.create(cart);
        }
        catch (error) {
            console.log(error);
        }
        return cartCreated;
    }
    async addProductToCart(cid,pid){
        let cart;
        let carrito;
        let product={
            id:product._id,
            quantity:1
        }
        try {
            cart=await this.model.findOne({_id:cid});
            let newCart=cart.products.find( elem=>elem=pid);
            if(newCart){
                newCart.quantity++;
                carrito = await this.model.updateOne({_id:cid},{products:newCart});
            }else{
                 carrito = await this.model.updateOne({_id:cid},{ $push: { products: product } });
            }}
            catch (error) {
                console.log(error);
            }
        }

}
export default CartManager;