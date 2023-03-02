const request = require('supertest');
const app = require('../index');
const db = require('../db');
const kill = require("kill-port");


const { resource } = require('../index');

describe('check sign up and sign in' , ()=>{
    
    it('should be able to sign in with correct sign up details' , async() =>{
        const data = {
            "name": "John",
            "username": "john1253",
            "email": "john314@mail.com",
            "password": "John1234"
        }
        const response = await request(app).post('/auth/register')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
        console.log(JSON.stringify(response.body));
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('username');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('email');
        
    })
    //done in tweet.test.js
    it('should be able to catch wrong password format (NOT ALPHANUMERIC) and give 401 code' , async()=>{
        const data = {
            "name": "John",
            "username": "john123",
            "email": "john34@mail.com",
            "password": "John@1234"
        }
        
        const response = await request(app).post('/auth/register')
                                           .set('Content-type' , 'application/json')
                                           .send(data);
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401);
        expect(response.body).toHaveProperty('message');

    })

    //done in tweet.test.js
    it('invalid username format (USERNAME LENGTH SMALLER THAN REQUIRED) , should give 401 code' , async()=>{
        const data = {
            "name": "John",
            "username": "jo",
            "email": "john34@mail.com",
            "password": "John1234"
        }
        
        const response = await request(app).post('/auth/register')
                                           .set('Content-type' , 'application/json')
                                           .send(data);
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401);
        expect(response.body).toHaveProperty('message');

    })



})


describe('Sign in functionality' , ()=> {
    it('should be able to sign in using correct credentials' , async()=>{
        const data = {
            'loginId' : "john1253", //username from above data
            'password':'John1234'
        }
        const response = await request(app).post('/auth/login')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
        expect(response.body.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.data).toHaveProperty('email');
    })

})

kill(3000, "tcp");