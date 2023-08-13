import passport from "passport";
 import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { getByEmail, createUser, getById } from "../DAO/sessionDAO.js";
import {userModel} from "../DAO/db/model/user.model.js";
import {createHash,isValidPassword} from "../utils/index.js";
 const LocalStrategy = local.Strategy;

const initializePassport = () => {
 
        passport.use( "register",
          new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) =>
             {
              let user = req.body;
              try {
                let userFound = await  getByEmail(user.email);
                if (userFound) {
                  return done(null, false);
                }
                user.password = createHash(user.password);
                let result = await  createUser(user);
                return done(null, result);
              } catch (error) {
                return done("Error al registrar el usuario " + error);
              }
            }
          )
        );
      
        passport.use(
          "login",
          new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
              let result = await  getByEmail(username);
      
              let userAdmin = "adminCoder@coder.com";
              let passAdmin = "adminCod3r123";
      
              if (
                !result ||
                !isValidPassword(result, password) ||
                username != userAdmin ||
                password != passAdmin
              ) {
                return done(null, false);
              }
              return done(null, result);
            }
          )
        );






    passport.use("github",new GitHubStrategy({ 

        // assReqToCallback: true, usernameField: "email"
    clientID: "Iv1.c4a3e0276414ab49" ,
    clientSecret:"971f256cf3955900efcb953b646b8d6eecf46f93",
    callbackURL:"http://localhost:8000/api/sessions/githubcallback"  ,
    scope:  ["user:email"] ,

    },
        async (accessToken, refreshToken, profile, done) => {
            try {
            // let user = req.body;
            let userEmail =  profile.emails[0].value;
            let userFound  = await getByEmail(userEmail);
            if (!userFound) {
                let newUser = {
                first_name: profile._json.login,
                last_name: "",
                email: userEmail,
                password: "",
                age: 20,
                };
                let result = await createUser(newUser);
                done(null, result);
            }else {
                done(null, userFound);
            }
            } catch (err) {
             done( err);
            }
        }
        ) 
    );

            // user.password = createHash(user.password);
            
            // let result = await createUser(user);
            // console.log(result);
            // return done(null, result);
            // passport.use("register", new LocalStrategy({
            //     passReqToCallback: true, usernameField: "email"
            // }, async (req, username, password, done) => {
            //     try {
            //         let user = req.body;
            //         let userFound = await getByEmail(user.email);
            //         if (userFound) {
            //             return done(null, false)
            //         }
            //         user.password = createHash(user.password);
            //         let result = await createUser(user);
            //         console.log(result);
            //         return done(null, result);
            //     } catch (err) {
            //         return done("error al registro usuario:" + err);
            //     }
        
            // }));
           
   
   
    // passport.use(
    //     "login",
    //     new GitHubStrategy(
    //     { usernameField: "email" },
    //     async (username, password, done) => {
    //         let result = await getByEmail(username);
    //         if (!user || !isValidPassword(result, password)) {
    //         return done(null, false);
    //         }
    //         delete result.password;
    //         return done(null, result);
    //     }
    //     )
    // );
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await getById(id);
        done(null, user);
    });
    }

    export default initializePassport;