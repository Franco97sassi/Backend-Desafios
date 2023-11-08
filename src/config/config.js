import dotenv from "dotenv";

dotenv.config();

export default {
  env: process.env.ENV,
  port: process.env.PORT,
  baseURL: process.env.BASE_URL,
  mongoUrl: process.env.MONGO_URL,
  githubClientID: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackURL: process.env.GITHUB_CALLBACK_URL,
  githubScope: process.env.GITHUB_SCOPE,
  sessionSecret: process.env.SESSION_SECRET,
   gmail_user_auth: process.env.GMAIL_USER_AUTH,
  gmail_user_auth: process.env.GMAIL_PASS_AUTH,
  backend_stripe_key: process.env.BACKEND_STRIPE_KEY,
  private_key_JWT: process.env.PRIVATE_KEY_JWT,
  frontend_stripe_key: process.env.FRONTEND_STRIPE_KEY,

   webhook_stripe_key: process.env.WEBHOOK_STRIPE_KEY,
};