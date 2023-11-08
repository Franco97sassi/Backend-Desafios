import ticketManager from "../DAO/ticketsDAO.js";

export default class TicketServices {
  constructor() {
    this.dao = new ticketManager();
  }

  async createTicket(productsToPurchase, uid) {
    let result = await this.dao.createTicket(productsToPurchase, uid);
    return result;
  }

  async getTicketByOrder(orderCode) {
    let result = await this.dao.getTicketByOrder(orderCode);
    return result;
  }
}