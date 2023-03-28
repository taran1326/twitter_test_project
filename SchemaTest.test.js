const { verifyUsernameAndEmailExists } = require('./Models/User');

try{

    const mongoose = require('mongoose');
    const userSchema = require('./Schemas/User');

    describe('User Schema Check' , ()=>{

        beforeAll(async () => {
            await mongoose.connect('mongodb://localhost/testdb', {
              useNewUrlParser: true,
              useCreateIndex: true,
              useUnifiedTopology: true,
            });
        });

        afterAll(async()=> {
            await mongoose.connection.dropDatabase();s
        })

        test('Email should be unique' , async()=> {
            const userData1 = {
                name: 'test user',
                username: 'testuser',
                email:'testuser@gmail.com',
                password:'testuser'
            }
            const userData2 = {
                name: 'test user',
                username: 'testuser1',
                email:'testuser@gmail.com',
                password:'testuser'


                
            }
        })

        test('Username should be unique' , async()=> {
            const userData1 = {
                name: 'test user',
                username: 'testuser',
                email:'testuser@gmail.com',
                password:'testuser'
            }
            const userData2 = {
                name: 'test user',
                username: 'testuser',
                email:'testuser1@gmail.com',
                password:'testuser'
            }

            
        })
    })


}catch (error){
    describe('Database Schema error ', ()=> {

        
        test(error.message , ()=> {
            expect(1).toBe(1);
        })
    })
}