const validator = require('validator');
const User  = require('../Models/User');
const jwt = require("jsonwebtoken");

function cleanUpAndValidate({name, username , email, phone, password}) {
    return new Promise((resolve, reject) => {

        if(!(name && username && password)) {
            return reject('Missing parameters');
        }


        // //working
        if(!validator.isEmail(email)) {
            return reject('Invalid Email');
        }

        if(validator.isEmail(username)) {
            return reject('Username cannot be an email');
        }

        if(phone && phone.length !== 10) {
            return reject('Invalid Phone number');
        }
        // working
        if(username.length < 3) {
            return reject('Username is too short');
        }
        //working
        if(username.length > 50) {
            return reject('Username should be at max 50 characters');
        }
        //working
        if(password.length < 6) {
            return reject('Password is too short ');
        }
        //working
        if(password.length > 200) {
            return reject('Password should be at max 200 characters long');
        }

        //working
        if(name.length > 100) {
            return reject('Name should be at max 100 characters long');
        }
        //working
        if(!validator.isAlphanumeric(password)) {
            return reject('Password should be alphanumeric');
        }

        resolve();
    })
}

const isAuth = async(req, res, next) => {

    // console.log(1243);
      // 1. Get the token;
      const token = req.headers.authorization;
      if(!token){
        //   console.log(123);
          return res.send("Token missing").status(401);
      }
      // 2. Check if token is in DB
      let jwtResponse;
        try{
          const response = await User.verifyTokenExists(token); //response : userDb
        //   console.log(response);
          if(!response){
            // console.log(12345);
            return res.send("Token invalid").status(401);
          }
          try{
            jwtResponse = jwt.verify(response.tokens, "THISISAPRIVATEKEY");
          }
          catch(err){
            // console.log("HELLO");
            return res.send("token 1invalid").status(401);
          }
        //   console.log(jwtResponse);
          req.user = jwtResponse;
        //   console.log(req.user._id);
        }
        catch(err){
            console.log(err);
        }
      
      next();
}

module.exports = { cleanUpAndValidate, isAuth };
