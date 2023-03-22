const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const UserSchema = require('../Schemas/User');
const tokenSchema = require('../Schemas/Tokens')
class User {

    username;
    email;
    phone;
    name;
    password;
    // token; //change
    _id;

    constructor({username, name, email, password, phone, id}) { //change
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.username = username;
        this.name = name;
        // this.token=token; //change
        this._id=id;
    }

    static  verifyUsernameAndEmailExists({username, email}) {
        return new Promise(async (resolve, reject) => {

            try {
                const user = await UserSchema.findOne({$or: [{username}, {email}]});

                if(user && user.email === email) {
                    return reject('Email already exists');
                }

                if(user && user.username === username) {
                    return reject('Username already taken');
                }

                return resolve();
            }
            catch(err) {
                return reject(err);
            }
        })
    }

    static verifyUserIdExists(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const userDb = await UserSchema.findOne({_id: userId});
                resolve(userDb);
            }
            catch(err) {
                reject(err);
            }
        })
    }

    static verifyTokenExists(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const userDb = await tokenSchema.findOne({tokens:token}); //change
                // console.log(userDb);
                resolve(userDb);
            }
            catch(err) {
                reject(err);
            }
        })
    }

    static loginUser({loginId, password}) {
        return new Promise( async (resolve, reject) => {
            let dbUser = await UserSchema.findOne({$or: [{email: loginId}, {username: loginId}]});

            if(!dbUser) {
                return reject("No user is found");
            }

            const isMatch = await bcrypt.compare(password, dbUser.password);

            if(!isMatch) {
                return reject('Invalid Password');
            }

            resolve({
                username: dbUser.username,
                name: dbUser.name,
                email: dbUser.email,
                password: dbUser.password,
                _id: dbUser._id
            });
        })
    }

    
    registerUser() {
        return new Promise(async (resolve, reject) => {

            const hashPassword = await bcrypt.hash(this.password, 1);

            const user = new UserSchema({
                username: this.username,
                name: this.name,
                password: hashPassword,
                email: this.email,
                phone: this.phone,
            })

            try {
                const dbUser = await user.save();

                return resolve({
                    username: dbUser.username,
                    name: dbUser.name,
                    email: dbUser.email,
                    _id: dbUser._id
                });
            }
            catch(err) {
                return reject(err);
            }
        })
    }

    updateUser(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await UserSchema.findOneAndUpdate({_id:id},
                {
                    username: this.username,
                    name: this.name,
                    password: this.password,
                    email: this.email,
                    phone: this.phone,
                    // token:this.token //change
                }
                );

                return resolve();
            }
            catch(err) {
                // console.log(err);
           
                return reject(err);
            }
        })
    }

    static logoutFromAllDevices(userId) {
        return new Promise(async (resolve, reject) => {

            try {
                const tokenDb = await tokenSchema.deleteMany({'userId': userId});

                resolve(tokenDb);
            }
            catch(err) {
                reject(err);
            }
        })
    }

}


module.exports = User; 
