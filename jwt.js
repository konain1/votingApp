
const jwt = require('jsonwebtoken')

// jwt middleware

const jwtAuthMiddleware = (req,res,next) =>{

    // Extract payload

    const token = req.headers.authorization.split(' ')[1];

    if(!token) return res.status(401).json({msg:'unAuthorize'})

    const decoded = jwt.verify(token,'secret')
    console.log(decoded)

    req.user = decoded;
    next();
}

const generateToken = (userData)=>{

    const token = jwt.sign(userData,'secret')

    return token;
}


module.exports = {jwtAuthMiddleware,generateToken}