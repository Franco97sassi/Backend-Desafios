import { userModel } from "./db/model/user.model.js";

class userManager {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    let result;
    try {
      result = await this.model.find();
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  async getByEmail(email) {
    let result;
    try {
      result = await this.model.findOne({ email: email });
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  async getUser(email) {
    let result;
    try {
      result = await this.model.findOne({ email: email }).select("-password");
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  async getById(id) {
    let result;
    try {
      result = await this.model.findOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  async createUser(user) {
    let result;
    try {
      result = this.model.create(user);
    } catch (error) {
      console.log(error);
    }
    return result;
  }
}

export default userManager;