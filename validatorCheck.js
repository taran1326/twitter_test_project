const mongoose = require('mongoose')

try{
    const {cleanUpAndValidate} = require('./Utils/Auth');
    describe('Password Check' , ()=> {
        test('password not present' , ()=> {
            const data = {
                "name" :"iamfirst",
                "username": "john12",
                "email": "john34@mail.com",
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })

        test('PASSWORD NOT ALPHANUMERIC' , ()=> {
            const data = {
                "name": "John",
                "username": "john123",
                "email": "john34@mail.com",
                "password": "John@1234"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })

        test('PASSWORD LENGTH LONGER THAN 200 CHARACTERS' , ()=> {
            const data = {
                "name": "John",
                "username": "john123",
                "email": "john34@mail.com",
                "password": "John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })

        test('PASSWORD LENGTH SHORTER THAN 6 CHARACTERS' , ()=> {
            const data = {
                "name": "John",
                "username": "john123",
                "email": "john34@mail.com",
                "password": "Joh"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })
    })
    describe('Email Check' , ()=> {
        test('email not present' , ()=> {
            const data = {
                "name" :"iamfirst",
                "username": "john12",
                "password": "John1234"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })

        test('email has wrong format (missing @ and .)' , ()=>{
            const data = {
                "name": "John",
                "username": "john12",
                "email": "john34mailcom",
                "password": "John1234"
            }

            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        });

        
    })
    describe('Username Check' , ()=> {
        test('username not present' , ()=> {
            const data = {
                "name" :"iamfirst",
                "password": "John1234",
                "email": "john34@mail.com"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })

        test('USERNAME IS EQUAL TO EMAIL' , ()=> {
            const data = {
                "name": "John",
                "username": "john34@mail.com",
                "email": "john34@mail.com",
                "password": "John1234" 
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })

        test('USERNAME LENGTH SMALLER THAN 3' , ()=> {
            const data = {
                "name": "John",
                "username": "jo",
                "email": "john34@mail.com",
                "password": "John1234"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })

        test('USERNAME LENGTH GREATER THAN 50' , ()=> {
            const data = {
                "name":"John",
                "username": "john1234567890john1234567890john1234567890john123456789",
                "email": "john34@mail.com",
                "password": "John1234"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })
        
    })
    describe('Name Check' , ()=> {
        test('name not present' , ()=> {
            const data = {
                "username": "john12",
                "password": "John1234",
                "email": "john34@mail.com"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);
        })

        it('NAME LENGTH LONGER THAN 100 CHARACTERS' , ()=>{
            const data = {
                "name": "JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn",
                "username": "john12",
                "email": "john34@mail.com",
                "password": "John1234"
            }
            return expect(cleanUpAndValidate(data)).rejects.toBeInstanceOf(Error);

        });
        
    })
}catch(err){
    describe('Function Check' , ()=> {
        test( err.message , ()=> {
            expect(err).toBeInstanceOf(ReferenceError); 
        })
    })

}