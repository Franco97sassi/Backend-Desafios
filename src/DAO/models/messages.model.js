import mongoose from "mongoose";
const messagesCollection= "messages";
const messagesSchema = new mongoose.Schema({
    user: {type: String },
    message: {type: String },
});
export const messagesModel = mongoose.model(messagesCollection, messagesSchema);