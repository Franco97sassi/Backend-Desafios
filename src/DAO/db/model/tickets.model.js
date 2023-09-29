import mongoose, { mongo } from "mongoose";

const ticketsCollection = "tickets";

const TicketsSchema = new mongoose.Schema({
 code: {
    type: String,
   },
 purchase_dateTime:  {
    type: Date,
   },  
  amount: {
    type: Number,
   },
  purchaser: {
    type: String,
   } 
});

export const ticketsModel = mongoose.model(ticketsCollection, TicketsSchema);