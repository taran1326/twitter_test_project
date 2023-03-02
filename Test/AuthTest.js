const fetch = require('cross-fetch');
const { compareArrays } = require('./Commons');
const app = require('../index');
const db = require('../db');

// Test Register
async function testRegister() {

    const data = {
        "name": "John",
        "username": "john123",
        "email": "john34@mail.com",
        "password": "John@1234"
    }

    try {
        let res = await fetch('http://localhost:3000/Auth/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        res = await res.json();

        if(res.status !== 200 && res.status !== 201) {
            return false;
        }

        const result = compareArrays(Object.keys(res.data), ['username', 'name', 'email']);

        if(!result) 
            return false;

        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

// Test Login
async function testLogin() {

    const data = {
        "loginId": "john123",
        "password": "John@123"
    }

    try {
        let res = await fetch('http://localhost:3000/Auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        res = await res.json();

        if(res.status !== 200 && res.status !== 201) {
            return false;
        }

        const result = compareArrays(Object.keys(res.data), ['username', 'name', 'email']);

        if(!result) 
            return false;

        return true;
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

async function tests() {
    const test1 = await testRegister();

    console.log(test1); 

    const test2 = await testLogin();

    console.log(test2);

    return [test1, test2];
}

tests();