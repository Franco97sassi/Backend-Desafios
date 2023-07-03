import mongoose from "mongoose";
const cartCollection= "carts";
const cartSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    timestamp: {type: Date, required: true},
    products: {type: Array, required: true},
    total: {type: Number, required: true}
});
export const cartModel = mongoose.model(cartCollection, cartSchema);