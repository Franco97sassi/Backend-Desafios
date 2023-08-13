import { Router } from 'express';
import { createUser, getAll, getByEmail } from '../DAO/sessionDAO.js';
import { authMiddleware, validateName } from '../middlewares/auth.js';
import { createHash, isValidPassword } from '../utils/index.js';
import passport from 'passport';
const  sessionsRouter = Router();
 
// sessionsRouter.get('/register', (req, res) => {
//   res.render('register', {})
// })

sessionsRouter.post('/register',
passport.authenticate("register",{failureRedirect:'/failregister'})
, async (req, res) => {

  // let user = req.body;

  //  let userFound = await getByEmail(user.email);
  //  if (userFound || user.email === "adminCoder@coder.com") {
  //   res.render('register-error', {});
  // } else if (userFound) {
  //   res.render('register-error', {});
  // } else {

  //   user.password = createHash(user.password);

  //   let result = await createUser(user);
    res.redirect('/login' );
  // }
})

// sessionsRouter.get('/', (req, res) => {
//   res.render('login', {})
// })


sessionsRouter.post('/login',
passport.authenticate("login",{failureRedirect:'/faillogin'}) ,

async (req, res) => {
  // let user = req.body;
  // let result = await getByEmail(user.email);
  // if (user.password != result.password) {
  //   res.render('login-error', {})
  // }
  // req.session.user = user.user;
  // res.render('products', {user: result.first_name})

  


  try {

    let role ;

    if (req.user.email === "adminCoder@coder.com" && req.user.password === "adminCod3r123") {
       role = "admin"
      req.session.user = { email:req.user.email, role };
      // res.render('products', { user: req.session.user });
      res.redirect('/products' );
    }

    let user = await getByEmail(email);
    if  (!user || !isValidPassword(user, password))
    {
      res.render('login-error', {})
      return;
    }else {  
      role = "user"
    req.session.user = { email:req.user.email,role,first_name };
    res.render('products', { user: req.session.user   })}

  } catch (err) {
    console.log(err);
    res.render('login-error', {})
  }
}

)
// sessionsRouter.get('/failregister', async (req, res) => {
//   res.render('register-error', {})
// })
// sessionsRouter.get('/faillogin', async (req, res) => {
//   res.render('login-error', {})
// })

// sessionsRouter.get('/profile', authMiddleware, async (req, res) => {
//   let user = await getByEmail(req.session.user);
//   res.render('datos', { user })
// })
// sessionsRouter.get('/logout', async (req, res) => {
//   req.session.destroy(error => {
//     res.render("login")
//   });
//   res.redirect('/')

// })

sessionsRouter.get('/github', passport.authenticate('github',
 { scope: ['user:email'] }), async (req, res) => {})

sessionsRouter.get('/githubcallback', 
passport.authenticate('github',
 { failureRedirect: '/login' }), async (req, res) => {
  req.session.user = req.user;

  res.redirect('/products' );
})

export default sessionsRouter;