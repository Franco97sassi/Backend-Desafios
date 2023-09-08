import { Router } from 'express';
import { createUser, getAll, getByEmail, getUser } from '../DAO/sessionDAO.js';
import { authMiddleware, validateName } from '../middlewares/auth.js';
import { createHash, isValidPassword, validatePassword } from '../utils/index.js';
import { generateToken, authToken } from '../utils/jwt.js';

import passport from 'passport';
const sessionsRouter = Router();
const usuarios = []
//  sessionsRouter.get('/login', (req, res) => {
//   if(req.session.counter){
//       req.session.counter++;
//       res.send(`${req.session.name} visitaste el sitio ${req.session.counter} veces.`)
//   }else{
//        let nombre = req.query.nombre ? req.query.nombre : '';
//       req.session.counter = 1;
//         req.session.name = nombre;
//       res.send(`Bienvenido ${req.session.name} al sitio.`)
//   }
// })


// sessionsRouter.get('/loginAdmin', (req, res) => {
//   if (req.session.counter) {
//     req.session.counter++;
//     res.send(`${req.session.name} vistaste el sitio ${req.session.counter} veces.`)
//   } else {
//     let nombre = req.query.nombre ? req.query.nombre : '';
//     req.session.counter = 1;
//     req.session.name = nombre;
//     req.session.admin = true;
//     res.send(`Bienvenido ${req.session.name} al sitio.`)
//   }
// })
// // sessionsRouter.get('/privada', auth, (req, res) => {
// //   res.send('Esto es privado')
// // })

// sessionsRouter.get('/kevin', validateName, (req, res) => {
//   res.send('Esto es privado para kevin')
// })
// // sessionsRouter.get('/logout', (req, res) => {
// //   req.session.destroy(err => { 
// //       if(!err) return res.send('Logout ok');
// //       res.send('Error al desloguear')
// //   }) 
// // })

sessionsRouter.get('/register', (req, res) => {
  res.render('register', {})
})
// sessionsRouter.post('/register',passport.authenticate("register",{failureRedirect:"/failregister"}) ,async (req, res) => {
//   // let user = req.body;
//   // let userFound = await getByEmail(user.email);
//   // if (userFound || user.email === "adminCoder@coder.com") {
//   //   res.render('register-error', {});
//   // }
//   // else if (userFound) {
//   //   res.render('register-error', {});
//   // } 


//   res.render('login', {})}

//  )

// sessionsRouter.post('/register',async (req,res)=>{
//   // const userBody=req.user;
//   //  const usuario=usuarios.find(usuario=>usuario.email==userBody.email)
//   // if(usuario){
//   //   return res.status(400).json({error:"usuario ya existente"})
//   // }
//   // usuario.push(userBody)
//   // const access_token=generateToken({email:userBody.email,password:userBody.password}  )
//   // res.cookie("authToken",access_token,{httpOnly:true}.json({msg:"usuario registrado exitosamente"}))
//   const { first_name, last_name, email,age, password } = req.body;
//   if (!first_name || !last_name || !email || !password|| !age) return res.send({ status: "error", error: "incomplete property for user creation" })
//   const user = await getByEmail(email)
//   if (user) return res.status(400).send({ status: "error", error: "user already exits" })
//   const newUser = {
//       first_name,
//       last_name,
//       email,
//       password,age
//   }
//   await createUser(newUser);
//   res.send({ status: "success", mgs: "user registered successfully" })

// })
sessionsRouter.post('/register', passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
  // let user = req.body;
  // let userFound = await getByEmail(user.email);
  // if (userFound || user.email === "adminCoder@coder.com") {
  //   res.render('register-error', {});
  // }
  // else if (userFound) {
  //   res.render('register-error', {});
  // } 


  // res.render('login', {})}
  res.redirect("/login")
})

sessionsRouter.post('/login', passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
  let { email, password } = req.body; // Deconstruir email y password del cuerpo de la solicitud

  try {

    let role = "user"; // Valor predeterminado del rol para usuarios normales

    // if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    //   role = "admin"; // Si las credenciales son de un administrador, cambia el rol
    //   email === "adminCoder@coder.com"
    //   req.session.user = role
    //   res.render('products', { user: req.session.user });
    // }

    // let user = await getByEmail(email);

    // if (!user || !isValidPassword(user, password)) {
    //   return res.render('login-error', {});
    // }
    if(!req.user)return res.render("login-error",{})

    // Asignar los datos de usuario a la sesión, incluyendo el rol
    //  req.session.user =   { email, role} 
    req.session.user = req.user.email
    res.render('products', { user: req.session.user }); // Enviar el objeto de usuario a la plantilla 'products'
  } catch (err) {
    console.log(err);
    res.render('login-error', {});
  }
});

sessionsRouter.get(("/failregister"), async (req, res) => {
  res.render("register-error", {})

}
)

// sessionsRouter.post('/login', passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
//   let { email, password } = req.body; // Deconstruir email y password del cuerpo de la solicitud

//   try {

//     let role = "user"; // Valor predeterminado del rol para usuarios normales

//     if ( email === "adminCoder@coder.com" &&  password === "adminCod3r123") {
//       role = "admin"; // Si las credenciales son de un administrador, cambia el rol
//       email === "adminCoder@coder.com"
//       req.session.user = role
//        res.render('products', {user: req.session.user});
//     }

//     let user = await getByEmail(email);

//       if (!user || !isValidPassword(user, password)) {
//       return res.render('login-error', {});
//     }

//     // Asignar los datos de usuario a la sesión, incluyendo el rol
//     //  req.session.user =   { email, role} 
//     req.session.user=req.user.email
//     res.render('products', { user: req.session.user  }); // Enviar el objeto de usuario a la plantilla 'products'
//   } catch (err) {
//     console.log(err);
//     res.render('login-error', {});
//   }
// });

// sessionsRouter.post('/login',async(req,res) =>{
//   const { email, password } = req.body
//   if (!email || !password) return res.send({ status: "error", error: "incomplete property for user login" })
//   const user = await getByEmail(email)
//   if (!user) return res.status(400).send({ status: "error", error: "user not found" })
//   if (!validatePassword(user, password)) return res.status(400).send({ status: "error", error: "invalid credentials" })

//   const access_token = generateToken(user)
//   // res.cookie("authToken",access_token).send({ status: "success",access_token,user})
//   res.cookie("authToken",access_token)
//   res.redirect("/current")
// }) 

sessionsRouter.get(("/faillogin"), async (req, res) => {
  res.render("login-error", {})

}
)
// sessionsRouter.get('/profile', authMiddleware, async (req, res) => {
//   let user = await getByEmail(req.session.user);
//   res.render('datos', { user })
// })
sessionsRouter.get('/logout', async (req, res) => {
  req.session.destroy(error => {
    res.render("login")
  });
  res.redirect('/')

})
sessionsRouter.get('/github', passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

sessionsRouter.get('/githubcallback', passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
  // if(!req.user){
  //   res.render('login-error', {})
  // }
  req.session.user = req.user.email;
  res.render('products', { user: req.session.user })


})

// sessionsRouter.get('/current',passport.authenticate("jwt",{session:false}),(req,res)=>{
//   res.send(req.user)
// })
// sessionsRouter.get('/current',authToken,async(req,res)=>{
//     // res.send('Si estas viendo esto es porque estas logueado',user.first_name)
//   const user = req.user; // El usuario autenticado ya se establece en el middleware 'authToken'
//   if (!user) {
//     return res.status(401).json({ error: "Usuario no autenticado" });
//   }
//   const access_token = req.cookies.authToken;

//   const response = {
//     status: "success",
//     access_token: access_token,
//     user: {
//       first_name: user.first_name,
//       last_name: user.last_name,
//       email: user.email,
//       // Otros campos de usuario que desees mostrar
//     }
//   };

//   // Devolver la respuesta JSON encolumnada
//   res.json(response);
// })
sessionsRouter.get('/api/session/current', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const user = req.session.user; // El usuario autenticado ya se establece en el middleware 'authToken'
 
  return res.json({ status: "success", payload: user});
});

// Devolver la respuesta JSON encolumnada

export default sessionsRouter;