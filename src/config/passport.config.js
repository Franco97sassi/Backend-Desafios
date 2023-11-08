import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import UserServices from "../services/session.js";
import config from "./config.js";
import logger from "../utils/logger.js";
import jwt from "passport-jwt";
import CartServices from "../services/cart.js";

// VARIABLES DE ENTORNO
const url = config.baseURL;
const githubClientID = config.githubClientID;
const githubClientSecret = config.githubClientSecret;
const githubCallbackURL = config.githubCallbackURL;
const PRIVATE_KEY = config.private_key_JWT;

const cartServices = new CartServices();
const userServices = new UserServices();
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: `${url}${githubCallbackURL}`,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let userEmail = profile.emails[0].value;
          let user = await userServices.getByEmail(userEmail);
          if (!user) {
            let newUser = {
              first_name: profile._json.login,
              last_name: "",
              email: userEmail,
              password: "",
              age: "",
              cart: null,
            };
            try {
              const cart = await cartServices.createCart();
              newUser.cart = cart;

              let result = await userServices.createUser(newUser);
              let updatedUser = await userServices.updateLastConnection(
                result.email
              );
              if (!updatedUser) {
                logger.error("No se pudo actualizar la última conexión");
              }
              done(null, { user: result });
            } catch (error) {
              done(error); // Maneja el error al crear el nuevo usuario
            }
          } else {
            let updatedUser = await userServices.updateLastConnection(
              userEmail
            );
            if (!updatedUser) {
              logger.error("No se pudo actualizar la última conexión");
            }
            done(null, user);
          }
        } catch (error) {
          done(error); // Maneja el error al buscar el usuario por email
        }
      }
    )
  );

  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          logger.info("Token verificado correctamente", jwt_payload);
          return done(null, jwt_payload);
        } catch (error) {
          logger.error("Error al verificar el token:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (data, done) => {
    let user = await userServices.getById(data.id);
    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["authToken"];
  }
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export default initializePassport;