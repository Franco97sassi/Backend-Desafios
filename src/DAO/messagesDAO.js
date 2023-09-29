import { messagesModel } from "./db/model/messages.model.js";

class MessagesManager {
  constructor() {
    this.model = messagesModel;
  }

  async addMessage(message) {
    let msg;
    try {
      msg = await this.model.create(message);
    } catch (error) {
      console.log(error);
    }
    return msg;
  }
}

export default MessagesManager;
