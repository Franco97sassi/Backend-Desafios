// import winston  from "winston";
// import * as dotenv from "dotenv"
// import config from "../config/config.js";
// // dotenv.config()
// const ENV=config.env
 
// const customLevelOptions={
//     levels:{
//         fatal:0,
//         error:1,
//         warning:2,
//         info:3,
//         http:4,
//         debug:5

//     },
//     color:{
//         fatal:"red",
//          error :"magenta",
//          warning :"yellow",
//         info :"blue",
//         http:"green",
//          debug :"white"
//     }
// }
// let logger;

// const buildProdLogger=()=>{
//     const logger= winston.createLogger({
//         levels:customLevelOptions.levels,
//         transports:[
//             new winston.transports.Console({
//                 level:"info",
//                 format:winston.format.combine( 
//              winston.format.colorize({colors:customLevelOptions.colors}),
//             winston.format.simple()
//             )
//             }),
//            new winston.transports.File({
//             filename:"./logs/file.log",level:"error"})
//          ]
//     })
//     return logger;
// }
 
// const buildDevLogger=()=>{
//     const logger=winston.createLogger({
//         levels:customLevelOptions.levels,
//         transports:[
//             new winston.transports.Console({
//                 level:"debug",
//                 format:winston.format.combine( 
//              winston.format.colorize({colors:customLevelOptions.colors}),
//             winston.format.simple()
//             )
//             }),
//             // new winston.transports.File({filename:"./file.log",level:"Info",format:winston.format.simple()})
//          ]
//     })
//     return logger;
// }
// // if(process.env.ENV==="production"){
// //     logger=buildProdLogger()
// //  }else{
// //     logger=buildDevLogger()

// //  }
// export default logger=
// ENV ==="production" ? buildProdLogger():buildDevLogger();
// export const addLogger=(req,res,next)=>{
//     req.logger=logger
//     // req.logger.info("este es un log info para todo los request que ingresen ")
//     next()
// }
// import winston from "winston";
// import config from "../config/config.js";

// const ENV = config.env;

// const customLevelsOptions = {
//   levels: {
//     fatal: 0,
//     error: 1,
//     warning: 2,
//     info: 3,
//     http: 4,
//     debug: 5,
//   },
//   colors: {
//     fatal: "red",
//     error: "magenta",
//     warning: "yellow",
//     info: "blue",
//     http: "green",
//     debug: "white",
//   },
// };

// let logger;

// const buildProdLogger = () => {
//   const logger = winston.createLogger({
//     levels: customLevelsOptions.levels,
//     transports: [
//       new winston.transports.Console({
//         level: "info",
//         format: winston.format.combine(
//           winston.format.colorize({ colors: customLevelsOptions.colors }),
//           winston.format.simple()
//         ),
//       }),

//       new winston.transports.File({
//         filename: "./logs/file.log",
//         level: "error",
//       }),
//     ],
//   });
//   return logger;
// };

// const buildDevLogger = () => {
//   const logger = winston.createLogger({
//     levels: customLevelsOptions.levels,
//     transports: [
//       new winston.transports.Console({
//         level: "debug",
//         format: winston.format.combine(
//           winston.format.colorize({ colors: customLevelsOptions.colors }),
//           winston.format.simple()
//         ),
//       }),
//     ],
//   });
//   return logger;
// };

// export default logger =
//   ENV === "production" ? buildProdLogger() : buildDevLogger();

// export const addLogger = (req, res, next) => {
//   req.logger = logger;
//   next();
// };
import winston from "winston";
import config from "../config/config.js";

const ENV = config.env;

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

let logger;

const buildProdLogger = () => {
  const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelsOptions.colors }),
          winston.format.simple()
        ),
      }),

      new winston.transports.File({
        filename: "./logs/file.log",
        level: "error",
      }),
    ],
  });
  return logger;
};

const buildDevLogger = () => {
  const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelsOptions.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });
  return logger;
};

export default logger =
  ENV === "production" ? buildProdLogger() : buildDevLogger();

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
