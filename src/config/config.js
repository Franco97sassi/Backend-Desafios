import dotenv from "dotenv"
dotenv.config()

export default{
    port:process.env.PORT,
    secret:process.env.SECRET,
    mongoURL:process.env.MONGO_URL,
    clientID:process.env.CLIENTID,
    clientSecret:process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL
}