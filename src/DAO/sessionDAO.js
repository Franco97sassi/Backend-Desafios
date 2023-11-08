import { sendMail } from "../services/mailing/mailing.js";
import { templateForgotPassword } from "../services/mailing/templates/templates.js";
import { generateToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { userModel } from "./db/model/users.model.js";

class userManager {
  constructor() {
    this.model = userModel;
  }

  async getAll() {
    let result;
    try {
      result = await this.model.find();
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async getUser(email) {
    let result;
    try {
      result = await this.model.findOne({ email: email }).select("-password");
    } catch (error) {
      logger.error(error);
    }
    return result;
  }

  async getByEmail(email) {
    let result;
    try {
      result = await this.model.findOne({ email: email });
    } catch (error) {
      logger.error(`LOG EN DAO: ${error}`);
    }
    return result;
  }

  async getById(id) {
    let result;
    try {
      result = await this.model.findOne({ _id: id });
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async createUser(user) {
    let result;
    try {
      result = this.model.create(user);
    } catch (error) {
      logger.error(`${error}`);
      throw new error({
        status: "error",
        msg: "No se pudo crear el usuario",
        error: error,
      });
    }
    return result;
  }

  async resetPassword(id, user) {
    let result;
    try {
      result = await this.model.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async getUserByResetToken(token) {
    let user;
    try {
      user = await this.model.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
    } catch (error) {
      logger.error(`${error}`);
    }
    return user;
  }

  async updateUser(email, fields) {
    let result;
    try {
      result = await this.model.updateOne({ email: email }, fields);
    } catch (error) {
      logger.error(`${error}`);
    }
    return result;
  }

  async sendEmailResetPassword(email) {
    let result;
    try {
      const user = await this.model.findOne({ email: email });
      const token = await generateToken(user, "1h");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 3600000);
      await this.updateUser(email, user);
      const options = await templateForgotPassword(email, token);
      result = await sendMail(options);
    } catch (error) {
      logger.error(`${error}`);
      throw new Error(
        `No existe una cuenta asociada a ese correo. Error: ${error}`
      );
    }
    return result;
  }

  async updateLastConnection(email) {
    try {
      const updatedUser = this.model.findOneAndUpdate(
        { email },
        { last_connection: new Date() },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      throw new Error(`Error al actualizar la última conexión: ${error}`);
    }
  }

  async updateDocument(uid, documentInfo) {
    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        uid,
        { $push: { documents: documentInfo } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      throw new Error(`Error al cargar los documentos: ${error}`);
    }
  }
  async checkDocuments(uid) {
    try {
      const user = await this.model.findById(uid);

      if (!user) {
        throw new Error(`Usuario con ID ${uid} no encontrado`);
      }

      const requiredDocuments = ["identification", "addresscomp", "countcomp"];
      const uploadedDocuments = user.documents.map((doc) => {
        const parts = doc.name.split("-");
        return parts[0];
      });
      return requiredDocuments.every((docType) =>
        uploadedDocuments.includes(docType)
      );
    } catch (error) {
      throw new Error(`Error al verificar documentos: ${error}`);
    }
  }

  async deleteAccounts(maxLastConnection) {
    try {
      const usersToDelete = await this.model.find({
        last_connection: { $lt: maxLastConnection },
      });

      const result = await this.model.deleteMany({
        last_connection: { $lt: maxLastConnection },
      });

      return { result, usersToDelete };
    } catch (error) {
      throw new Error(
        `Ocurrió un error al eliminar usuarios inactivos: ${error}`
      );
    }
  }

  async deleteUser(uid) {
    try {
      const result = await this.model.findByIdAndDelete(uid);
      return result;
    } catch (error) {
      throw new Error(`Ocurrió un error al eliminar el usuario: ${error}`);
    }
  }
}

export default userManager;