 

// export const auth=(req,res,next)=>{
//     const token=req.cookies.authToken
//     if(!token){
//         return res.status(401).json({
//             error:"no tiene token",
//             msg:"no tiene token"

//         })
//     }
//     try{
//         req.user=jwt.verify(token,PRIVATE_KEY)
//     }catch(error){
//         return res.status(403).json({
//             error:"token invalido",
//             msg:"el token enviado no es valido"
//         })
//     }
//     next()
//  }
//  export const generateToken=user=>{
//     const token=jwt.sign(user,PRIVATE_KEY,{expiresIn:"24hs"});
//     return token
//  }

//  export const authToken=(req,res,next)=>{
//     let token;
//     const authHeaders=req.headers.Authorization?req.headers.Authorization:req.headers.Authorization;
//     const cookieToken=req.cookies["authToken"];
//     if(!authHeaders&&!cookieToken)return res.status(401).send({error:"no token received"})
// if(authHeaders){
//     token=authHeaders.split("")[1]
// } else{
//     token=cookieToken
// }
// jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
//     if(error) return res.status(403).send({error:"Not authorized"})
//     req.user=credentials.user;
// next()
// })
// }
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const PRIVATE_KEY = config.private_key_JWT;

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};