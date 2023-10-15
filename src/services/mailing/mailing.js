import nodemailer from "nodemailer";
import config from "../../config/config.js";

const GMAIL_USER_AUTH = config.gmail_user_auth;
const GMAIL_PASS_AUTH = config.gmial_pass_auth;

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: GMAIL_USER_AUTH,
    pass: GMAIL_PASS_AUTH,
  },
});

export const sendMail = async (options) => {
  let result = await transport.sendMail(options);
  return result;
};