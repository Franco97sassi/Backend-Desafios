export const authMiddleware = (req, res, next) => {
    if(req.session.user){
        next()
    }else{
        res.render('login', { status: 'failed'})
    }
}
export const validateName = (req, res, next) => {
    if(req.session.name == 'Kevin'){
        next()
    }else{
        res.send('No sos kevin')
    }
} 
 