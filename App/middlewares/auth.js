const jwt = require('jsonwebtoken')

const authenticateUser =(req, res, next)=>{
    const token = req.headers['authorization']
    if(!token){
       return res.status(401).json('token is required')
    }
    try{
        const data =jwt.verify(token, process.env.SEACREAT_KEY)
        req.currentUser = {
            id : data.id,
            role : data.role
        }
        next();
    }
    catch(err){
        console.error(err)
        return res.status(401).json({error :'invalid token'})
    }
}

const authorizeUser = (permittedRoles)=>{
    return (req, res, next)=>{
        if(permittedRoles.includes(req.currentUser.role)){
            next();
        }else{
            res.status(403).json({errors : 'Unauthorized'});
        }
    };
};

module.exports = {
    authenticateUser:authenticateUser,
    authorizeUser : authorizeUser
}