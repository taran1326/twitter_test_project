const express = require('express');
const jwt = require("jsonwebtoken");

const { cleanUpAndValidate, isAuth } = require('../Utils/Auth');
const User  = require('../Models/User');
const tb_tokens = require('../Schemas/Tokens');

const authRouter = express.Router();
const tokenSchema = require('../Schemas/Tokens')
authRouter.post('/register', async (req, res) => {

    const { username, email, name, password, phone } = req.body;

    // Validate the data for errors
    cleanUpAndValidate({username, email, name, password, phone}).then(async () => {
        try {
            await User.verifyUsernameAndEmailExists({username, email});
        }
        catch(err) {
            return res.send({
                status: 401,
                message: err
            })
        }
        // Create and register user
        const user = new User({name, password, username, email, phone});

        try {
            const dbUser = await user.registerUser();

            return res.send({
                status: 200,
                message: "Registration Successful",
                data: dbUser
            })
        }
        catch(err) {
            console.log(err.message); 
            return res.send({
                status: 401,
                message: "Database Error. Please try again",
                err: err
            })
        }
    })
    .catch(err => {
        console.log(err.message); 
        return res.send({
            status: 401,
            message: err
        })
    });
})

authRouter.post('/login', async (req, res) => {

    const { loginId, password } = req.body;

    if(!loginId || !password) {
        return res.send({
            status: 500,
            message: "Parameters missing"
        })
    }

    try {
        const dbUser = await User.loginUser({loginId, password});

        // console.log(dbUser);
        const token = jwt.sign({
            email: dbUser.email,
            username: dbUser.username,
            name: dbUser.name,
            _id: dbUser._id,
            creationTime : new Date()
        }, "THISISAPRIVATEKEY", {expiresIn:'1h'});


        const userObject = new tb_tokens({
            userId : dbUser._id,
            tokens: token
        });
        tb_tokens.insertMany(userObject);
        // console.log(userObject);


        return res.send({
            status: 200,
            message: "Logged in Successfully",
            data: dbUser
        })
    }
    catch(err) {
        return res.send({
            status: 404,
            message: "Error occured",
            error: err
        })
    }
})

authRouter.post('/logout', isAuth, async (req, res) => {

    // console.log(1223);
    // const userData = req.session.user;
    const token = req.headers.authorization;
    const dbUser = await User.verifyTokenExists(token);
    // dbUser.token=null; //change

    tb_tokens.findOneAndDelete({tokens : token } , (err)=>{
        if(err){
            console.log(err);
        }
    });

    // const userToUpdate = new User(dbUser); //change
    // userToUpdate.updateUser(dbUser._id); //change
    return res.send({
        status: 200,
        message: "Logout successful",
        // data: 
    })
})

authRouter.post('/logout_from_all_devices', isAuth ,async (req, res) => {

    const token = req.headers.authorization;
    const aboutUser = await tokenSchema.findOne({tokens : token});
    const userID = aboutUser.userId;

    const tokenDb = await tb_tokens.deleteMany({userId : userID});


    // const token = req.header.authorization;
    // const jwtResponse = jwt.verify(token, "THISISAPRIVATEKEY");
    // req.user = jwtResponse;

    // const userId = req.user._id;

    try {
    //     const tokenDb = await tokenSchema.remove({'userId': userId});
        return res.send({
            status: 200,
            message: "Logged out from all devices",
            data: tokenDb
        })
    }
    catch(err) {
        return res.send({
            status: 200,
            message: "Internal server error. Logout failed.",
            error: err
        })
    }

})

module.exports = authRouter;