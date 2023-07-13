import mongoose from "mongoose";

const messagesCollection = "messages";

const MessagesSchema = new mongoose.Schema({
  user: {
    type: String,
    requiered: true,
  },
  message: {
    type: String,
    requiered: true,
  },
});

export const messagesModel = mongoose.model(messagesCollection, MessagesSchema);
