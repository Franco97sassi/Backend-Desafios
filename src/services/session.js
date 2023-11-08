import userManager from "../DAO/sessionDAO.js";
import UserDTO from "../DAO/DTO/userDTO.js";
import { templateDeleteAccount } from "./mailing/templates/templates.js";
import { sendMail } from "./mailing/mailing.js";

export default class UserServices {
  constructor() {
    this.dao = new userManager();
  }

  async getAll() {
    let result = await this.dao.getAll();
    let users = result.map((user) => new UserDTO(user));
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

  async resetPassword(email, newPass) {
    let result = await this.dao.resetPassword(email, newPass);
    return result;
  }

  async updateUser(email, fields) {
    let result = await this.dao.updateUser(email, fields);
    return result;
  }

  async getUserByResetToken(token) {
    let result = await this.dao.getUserByResetToken(token);
    return result;
  }

  async sendEmailResetPassword(email) {
    let result = await this.dao.sendEmailResetPassword(email);
    return result;
  }

  async updateLastConnection(email) {
    let result = await this.dao.updateLastConnection(email);
    return result;
  }

  async updateDocument(uid, documentInfo) {
    let result = await this.dao.updateDocument(uid, documentInfo);
    return result;
  }

  async checkDocuments(uid) {
    let result = await this.dao.checkDocuments(uid);
    return result;
  }

  async deleteAccounts(maxLastConnection) {
    try {
      const { result, usersToDelete } = await this.dao.deleteAccounts(
        maxLastConnection
      );

      if (result.deletedCount > 0) {
        for (const user of usersToDelete) {
          const options = templateDeleteAccount(user.email);
          const resultMail = await sendMail(options);
        }
      }

      return { result, usersToDelete };
    } catch (error) {
      throw new Error(
        `Ocurrió un error al eliminar usuarios inactivos: ${error}`
      );
    }
  }

  async deleteUser(uid) {
    let result = await this.dao.deleteUser(uid);
    const options = templateDeleteAccount(result.email);
    const resultMail = await sendMail(options);
    return result;
  }
}