 
export const authMiddleware = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.render('login', { status: 'failed'})
    }
}
// export const validateName = (req, res, next) => {
//     if(req.session.name == 'Kevin'){
//         next()
//     }else{
//         res.send('No sos kevin')
//     }
// } 

  export  function isAdmin(req,res,next){
    if(req.user.role==="admin")
    {
        next()
    }else{
        res.status(403).send({
            status:"error",
            error:"tu usuario no cuenta con privilegios para realizar operacion"
        })
    }
  }

  export function isUser(req,res,next){
    if(req.user.role==="user"){
        next()
    }else{
        res.status(403).send({
             error:"tu usuario no cuenta con privilegios para realizar operacion"
        })
    }
  }