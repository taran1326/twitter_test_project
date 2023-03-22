
const User  = require('../Models/User');
const jwt = require("jsonwebtoken");

const auth = async (req, res, next)=>{

    // 1. Get the token;
    const token = req.headers.authorization;
    if(!token){
        return res.end("Token missing").status(401);
    }
    // 2. Check if token is in DB
    try{
        const response = await User.verifyTokenExists(token);
       
    }catch(err){
        return res.end("Token invalid").status(401);
    }
    next();

}

export default auth;