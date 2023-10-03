import {calculateTotalAmount,generateUniqueCode} from "../utils/index.js"
import {ticketsModel} from "./db/model/tickets.model.js"
class TicketManager{
    constructor(){
        this.model=ticketsModel
    }

async createTicket(uid,productsToPurchase){ 
try {
    const totalAmount=calculateTotalAmount(productsToPurchase)
    const code=generateUniqueCode();
    const ticketData={
        code,
        purchase_datetime: new Date(),
        amount:totalAmount,
        purchaser:uid
    }
    const createdTicket=await this.model.create(ticketData)
    return createdTicket
} catch (error) {
    logger.error(`${error}`);
    return{
        success:false,
        message:`Ocurrio un error al crear al ticket`
    }
}

}  

async getTicketByOrder(orderCode){
    try {
        const ticket= await ticketsModel.findOne({code:orderCode})
        if(!ticket){
            return{
                success:false,
                message:`Ticket no encontrado para el codigo ${orderCode}`
            }

        }
        return{
            success:true,
            message:"Ticket encontrado exitosamente",
            ticket,
        }
    } catch (error) {
        return{
            success:false,
            message:`Ocurrio un error al obtener un ticket`
        }
    }}  }

    export default TicketManager