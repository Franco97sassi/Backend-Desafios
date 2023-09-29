import userManager from "../DAO/sessionDAO.js";
import UserDTO from "../DAO/DTO/userDTO.js";

export default class UserServices {
  constructor() {
    this.dao = new userManager();
  }

  async getAll() {
    let users = await this.dao.getAll();
    return users;
  }

  async getByEmail(email) {
    let user = await this.dao.getByEmail(email);
    return user;
  }

  async getUser(email) {
    let result = await this.dao.getByEmail(email);
    let user = new UserDTO(result);
    return user;
  }

  async getById(uid) {
    let user = await this.dao.getById(uid);
    return user;
  }

  async createUser(user) {
    let result = await this.dao.createUser(user);
    return result;
  }
 
async resetPassword(email,newPass){
  let result = await this.dao.resetPassword(email,newPass);
  return result;
}
async updateUser(email,fields){
  let result = await this.dao.updateUser(email,fields);
  return result;
}
async getUserByResetToken(token){
  let result = await this.dao.getUserByResetToken(token);
  return result;
}
async sendEmailResetPassword(email){
  let result = await this.dao.sendEmailResetPassword(email);
  return result;
}


}