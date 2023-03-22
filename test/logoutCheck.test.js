const request = require('supertest');
const {app , store} = require('../index');
const db = require('../db');
const {connect} = require('../db');
const tb_tweet = require('../Schemas/Tweets');
const tb_user= require('../Schemas/User');
const bcrypt = require('bcrypt');
const mockSession = require('mock-session')


const userSchema = require('../Schemas/User')


let res1;
describe('login and then logout ' , () =>{
    it('User X should be able to sign in with valid credentials' , async()=>{
        const passwordstring = "Rajat3592";
        const hashedPassword = await bcrypt.hash( passwordstring, 1);
        console.log(hashedPassword);
        const mydata = new userSchema(
            {   
                "username": "Rajat3592",
                "email": "rajat3592@mail.com",
                "name": "Rajat",
                "password": hashedPassword

            }
        );

        mydata.save();


        
        res1 = await request(app).post('/auth/login')
                                .set('Content-type', 'application/json')
                                .send({
                                        'loginId':"Rajat3592",
                                        'password':"Rajat3592"
                                }).expect(200);


        console.log(res1.body.data._id);


        //fetched user from database and matched loginId of input data with username of fetched user

        const fetchUserSignIn = await tb_user.findOne({'username' : "Rajat3592" });
        expect(fetchUserSignIn.username).toEqual("Rajat3592");

        

        // const ourPassword = await bcrypt.hash("Rajat3592" , 1);
        // console.log(ourPassword);
        // console.log(mydata.password);
        //fetched password of user from database
        console.log(passwordstring);
        console.log(fetchUserSignIn.password);
        const boolAns = await bcrypt.compare(passwordstring , fetchUserSignIn.password);
        expect(boolAns).toBeTruthy();

        expect(res1.body).toHaveProperty('message');
        expect(res1.body.data).toHaveProperty('email');
        expect(res1.body.data).toHaveProperty('_id');
        expect(res1.body.data).toHaveProperty('username');
        

    });
})