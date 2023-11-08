import { calculateTotalAmount, generateUniqueCode } from "../utils/index.js";
import logger from "../utils/logger.js";
import { ticketsModel } from "./db/model/tickets.model.js";

class TicketsManager {
  constructor() {
    this.model = ticketsModel;
  }

  async createTicket(productsToPurchase, uid) {
    try {
      const totalAmount = calculateTotalAmount(productsToPurchase);
      const code = generateUniqueCode();

      const ticketData = {
        code,
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: uid,
      };
      const createdTicket = await this.model.create(ticketData);
      return createdTicket;
    } catch (error) {
      logger.error(`${error}`);
      return {
        success: false,
        message: `Ocurrió un error al crear el ticket: ${error}`,
      };
    }
  }

  async getTicketByOrder(orderCode) {
    try {
      const ticket = await ticketsModel.findOne({ code: orderCode });
      if (!ticket) {
        return {
          success: false,
          message: `Ticket no encontrado para el código de orden ${orderCode}`,
        };
      }
      return {
        success: true,
        message: "Ticket encontrado exitosamente.",
        ticket,
      };
    } catch (error) {
      logger.error(error);
      return {
        success: false,
        message: `Ocurrió un error al obtener el ticket: ${error}`,
      };
    }
  }
}

export default TicketsManager;