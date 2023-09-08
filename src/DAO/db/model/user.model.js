import mongoose from "mongoose";
const userCollection = "users";
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type:String,unique:true },
    password: String,
    age: Number,
    cart:{
        _id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"cart"
    }},
    role:{type:String,default:"user"}
});

export const userModel = mongoose.model(userCollection, userSchema)