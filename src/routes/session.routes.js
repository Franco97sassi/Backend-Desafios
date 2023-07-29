import { Router } from 'express';
import { createUser, getAll, getByEmail } from '../DAO/sessionDAO.js';
import { authMiddleware, validateName } from '../middlewares/auth.js';
const sessionsRouter = Router();

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
sessionsRouter.post('/register', async (req, res) => {
  let user = req.body;
  let userFound = await getByEmail(user.email);
  if  (userFound)    {
    res.render('register-error', {})
  }
  let result = await createUser(user);

  res.render('login', {})
})

sessionsRouter.get('/', (req, res) => {
  res.render('login', {})
})


sessionsRouter.post('/login', async (req, res) => {
  // let user = req.body;
  // let result = await getByEmail(user.email);
  // if (user.password != result.password) {
  //   res.render('login-error', {})
  // }
  // req.session.user = user.user;
  // res.render('products', {user: result.first_name})
  let { email, password  } = req.body;
  try {
    let user = await getByEmail(email);
    if ((!user || password !== user.password) && (email !== "adminCoder@coder.com")) {
      res.render('login-error', {})
      return;
    }
    let role = "usuario"
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      role = "admin"
    }
    req.session.user = { email,role,};
    res.render('products', { user: req.session.user   })
  } catch (err) {
    console.log(err);
    res.render('login-error', {})
  }
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


export default sessionsRouter;