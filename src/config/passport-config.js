import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2'
 import { createHash, isValidPassword } from '../utils/index.js';
import jwt from "passport-jwt";
import config from './config.js';
import userManager from '../DAO/sessionDAO.js';
const managerSession = new userManager();

  const LocalStrategy = local.Strategy;
// const JWTStrategy=jwt.Strategy;
// const ExtractJWT=jwt.ExtractJwt;

// const cookieExtractor=req=>{
//     let token=null;
//     if(req&&req.cookies){
//         token=req.cookies["authtoken"]
//     }
//     return token;
// }
const CLIENTID=config.clientID
const CLIENTSECRET=config.clientSecret
const CALLBACKURL=config.callbackURL

 const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true, usernameField: "email"
    }, async (req, username, password, done) => {
        try {
            let user = req.body;
            let userFound = await managerSession.getByEmail(user.email);
            if (userFound) {
                return done(null, false)
            }
            user.password = createHash(user.password);
            let result = await managerSession.createUser(user);
            console.log(result);
            return done(null, result);
        } catch (err) {
            return done("error al registro usuario:" + err);
        }

    }));

// const initializePassport=()=>{
//     passport.use("jwt",new JWTStrategy({
//         jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
//         secretOrKey:"clavesecreta"
//     },async(jwt_payload,done)=>{
//         try{
//             // return done(null,jwt_payload)

           
//               // Aquí puedes realizar la lógica para verificar y autenticar al usuario
//               // ...
          
//               // Si el usuario es válido, devolverlo
//               return done(null, jwt_payload);
//         }catch(err){
//             return done(err)
//         }
//     }))
//         passport.serializeUser(function(user, done)   {
//             done(null, user.username);
//         }
//         );
//         passport.deserializeUser( function(username, done){
//             const usuario=usuarios.find(usuario=>usuario.username==username)
//             done(null, usuario);
//         }
//         );
//          }
    
 

passport.use('login', new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
 
    // if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
    //     // Si las credenciales son las del administrador, establecer el rol como "admin"
    //     let adminUser = { email: username, role: "admin" };
    //     return done(null, adminUser);
    // }
    let result = await managerSession.getByEmail(username);

    if (!result || !isValidPassword(result, password)) {
        return done(null, false);
    }

    console.log(result);
    delete result.password;
    return done(null, result);
}));




    
    passport.use("github", new GithubStrategy({
        clientID: CLIENTID,
        clientSecret: CLIENTSECRET,
        callbackURL:CALLBACKURL,
        scope: ["user:email"]
        },async (accessToken, refreshToken, profile, done) => {
            try{
                let userEmail= profile.emails[0].value;
                let userFound= await managerSession.getByEmail(userEmail);
                if(!userFound){
                    let newUser=  {
                        first_name: profile.json.first_name,
                        last_name: "",
                        email: userEmail,
                        password: "",
                        age:20,
                         
                    }
                   let result= await managerSession.createUser(newUser);
                     done(null, result);
                }else{
                    done(null, userFound);                            
                }
            }catch(error){
             return   done(error);
              
        }}
    ));
    
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    }
    );
    passport.deserializeUser( async(id, done) => {
        let user= await managerSession.getById(id);
        done(null, user);
    }
    );
     }

     export default initializePassport;

