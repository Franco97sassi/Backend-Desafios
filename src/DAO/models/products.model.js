import mongoose from "mongoose";
const productsCollection= "products";
const productsSchema = new mongoose.Schema({
      title: {type: String, required: true, max: 100},
    description: {type: String, required: true, max: 100},
    code: {type: String, required: true, max: 100},
    category: {type: String, required: true, max: 100},
    price: {type: Number, required: true},
    stock: {type: Number, required: true}

});
export const productsModel = mongoose.model(productsCollection, productsSchema);