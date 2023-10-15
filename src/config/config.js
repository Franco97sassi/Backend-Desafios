import dotenv from "dotenv"
dotenv.config()

export default{
    port:process.env.PORT,
    secret:process.env.SECRET,
    mongoURL:process.env.MONGO_URL,
    clientID:process.env.CLIENTID,
    clientSecret:process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL,
    env:process.env.ENV,
    private_key_JWT: process.env.PRIVATE_KEY_JWT,
    gmail_user_auth: process.env.GMAIL_USER_AUTH,
    gmial_pass_auth: process.env.GMAIL_PASS_AUTH,
}