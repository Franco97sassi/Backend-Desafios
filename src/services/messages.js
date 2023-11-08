import MessagesManager from "../DAO/messagesDAO.js";

export default class MessagesServices {
  constructor() {
    this.dao = new MessagesManager();
  }

  async addMessage(message) {
    let result = await this.dao.addMessage(message);
    return result;
  }
}