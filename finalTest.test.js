const request = require('supertest');
const app = require('./index');
const db = require('./db');
const tb_tweet = require('./Schemas/Tweets');
const tb_user = require('./Schemas/User');
const tb_tokens = require('./Schemas/Tokens');
const bcrypt = require('bcrypt');
const userSchema = require('./Schemas/User');


const jwt = require('jsonwebtoken');

const User = require('./Models/User');
const { ObjectId } = require('mongodb');
const Tweets = require('./Schemas/Tweets');
const { disabled } = require('./index');
const { default: mongoose } = require('mongoose');


describe('Database test suite' , () => {
    afterAll(async()=> {
        await mongoose.connection.db.dropCollection('tb_users')
        await mongoose.connection.db.dropCollection('tb_tokens')
        await mongoose.connection.db.dropCollection('tb_tweets')
    })

                                    /*Major functionality tests */


    // to clear all the collections in database before running tests

    let res , res1 ; 

    describe('User X Sign Up functionality check' , ()=> {
        //to clear the users collection in database after runnig the tests
        // afterAll(async()=> {
        //     await tb_user.deleteMany({});
        // })

        beforeAll(async()=> {
            await tb_user.deleteMany({});
        })

        afterAll(async()=>{
            await tb_user.deleteMany({});
        })



        const data = {
            name: "test user",
            username: "testuser",
            email: "testuser@mail.com",
            password: "testuser"
        }
        
        test('User X should be able to register if credentials are valid' , async()=>{
            const response = await request(app).post('/auth/register')
                                    .set('Content-type', 'application/json')
                                    .send(data) 
            // console.log(res.body.data);
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('username');
            expect(response.body.data).toHaveProperty('name');
            expect(response.body.data).toHaveProperty('email');
            expect(response.body.data.email).toBe("testuser@mail.com");
            expect(response.body.data.username).toBe("testuser");
            expect(response.body.data.name).toBe("test user");
            
        });

        test('if user X signs up length of collection should increase' , async()=>{
            const num = await tb_user.countDocuments();
            expect(num).toBe(1);

        })
        test('Signed up user should be present in database and password should be hashed properly' , async()=>{
            
            const result = await tb_user.findOne({'name':'test user'});
            expect(result.name).toEqual(data.name);
            expect(result.email).toEqual(data.email);
            expect(result.username).toEqual(data.username);


            const isMatch = await bcrypt.compare(data.password ,result.password );
            expect(isMatch).toBe(true);
        }) 

        //Duplicate user check if same email
        test('should give an error if the user exists (same email)' , async() => {
            const data = {
                "name": "test user",
                "username": "testusersignup",
                "email": "testuser@mail.com",
                "password": "testuser"
            }
            const response = await request(app).post('/auth/register')
                                    .set('Content-type', 'application/json')
                                    .send(data)
                                    
            expect(response.body.status).toBe(401);
        })

        it('should give an error if the user exists (same username)' , async() => {

            const data = {
                "name": "test user",
                "username": "testuser",
                "email": "testusersignup@mail.com",
                "password": "testuser"
            }
            const response = await request(app).post('/auth/register')
                                    .set('Content-type', 'application/json')
                                    .send(data)
                                    
            expect(response.body.status).toBe(401);
        })
    });




    describe('User X Sign In functionality check ', ()=>{


        //after running the tests clear all the users and tokens
        afterAll(async() => {
            tb_user.deleteMany({});
            tb_tokens.deleteMany({});
        })


        

        it('should give an error (500 code) if password missing' , async() => {
            const errorPasswordMissing = await request(app).post('/auth/login')
                                    .set('Content-type', 'application/json')
                                    .send({
                                            'loginId':"john1353"
                                    })
            expect(errorPasswordMissing.body.status).toBe(500);
        })
        it('should give an error (500 code) if loginID missing' , async() => {
            const errorSignInLoginID = await request(app).post('/auth/login')
                                    .set('Content-type', 'application/json')
                                    .send({
                                            'password':'John1234'
                                    })
            expect(errorSignInLoginID.body.status).toBe(500);

        })

        it('should give an error (404 code) if user has not registered before' , async() => {
            const errorNoUserFound = await request(app).post('/auth/login')
                                    .set('Content-type', 'application/json')
                                    .send({
                                            'loginId':'Taran123',
                                            'password':'John1234'
                                    })
            expect(errorNoUserFound.body.status).toBe(404);

        })

        it('should give an error (404 code) if user enters wrong password' , async() => {
            const errorNoUserFound = await request(app).post('/auth/login')
                                    .set('Content-type', 'application/json')
                                    .send({
                                        'loginId':"john1353",
                                        'password':'John1236'
                                    })
            expect(errorNoUserFound.body.status).toBe(404);

        })

        


        it('User X should be able to sign in with valid credentials' , async()=>{


            const passwordstring = "John1234";
            const hashedPassword = await bcrypt.hash( passwordstring, 1);
            // console.log(hashedPassword);
            const mydata = new userSchema(
                {   
                    "username": "john1353",
                    "email": "john3152@mail.com",
                    "name": "John",
                    "password": hashedPassword
    
                }
            );
            
            

            await tb_user.insertMany(mydata);




            const responseLogIn = await request(app).post('/auth/login')
                                    .set('Content-type', 'application/json')
                                    .send({
                                            'loginId':"john1353",
                                            'password':'John1234'
                                    }).expect(200);


            //fetched user from database and matched loginId of input data with username of fetched user

            const fetchUserSignIn = await tb_user.findOne({'loginId':"john1353" });
            expect(fetchUserSignIn.username).toEqual("john1353");
            

            //fetched password of user from database 
            const boolAns = await bcrypt.compare('John1234' , fetchUserSignIn.password);
            expect(boolAns).toBeTruthy();
            
 
            //increase in len of the tokens collection
            const lenOfTokensCollection = await tb_tokens.countDocuments({});
            expect(lenOfTokensCollection).toBe(1); 
            expect(responseLogIn.body).toHaveProperty('message');
            expect(responseLogIn.body.data).toHaveProperty('email');
            expect(responseLogIn.body.data).toHaveProperty('_id');
            expect(responseLogIn.body.data).toHaveProperty('username');
            
            // console.log(responseLogIn.headers);
        })
        



    }); 

    let token;

    describe('User X Create Tweeet functionality' , ()=>{


        let token , dbUser;
        
        beforeAll(async()=> {
            const passwordstring = "TaranIsTheOne";
            const hashedPassword = await bcrypt.hash( passwordstring, 1);
            // console.log(hashedPassword);
            const mydata = new userSchema(
                {   
                    "username": "TaranIsTheOne",
                    "email": "taranisgood@mail.com",
                    "name": "Taran Mittal",
                    "password": hashedPassword
                }
            );

            await tb_user.insertMany(mydata);


            // dbUser = await tb_user.findOne({username:});
            dbUser = await tb_user.findOne({username:'TaranIsTheOne'});
            

            // console.log(dbUser);
            token = jwt.sign({
                email:mydata.email ,
                username: mydata.username, 
                name:mydata.name ,
                _id: dbUser._id,
                creationTime:new Date()
            }, "THISISAPRIVATEKEY");

            const userObject = new tb_tokens({
                userId : dbUser._id,
                tokens: token
            });
            tb_tokens.insertMany(userObject);


            // dbUser.token = token; 
            // const userToUpdate = new User(dbUser);
            // console.log(userToUpdate);
            // await userSchema.findOneAndUpdate({_id: dbUser._id} , userToUpdate);
        });

        // beforeEach(done => {
        //     setTimeout(() => {
        //       done();
        //     }, 2000); // delay for 2 seconds
        // });

        afterAll(async() => {
            await tb_user.deleteMany({});
            await tb_tweet.deleteMany({}); 
            await tb_tokens.deleteMany({});
        })


        test('user X should be able to create a new tweet' , async() =>{



            const data1 = {
                'title':'User X', 
                'bodyText':'Helloworld i am tester 1',
                'userId':dbUser._id,
                'creationDatetime': new Date()
            }
            JSON.stringify(data1)

            const response = await request(app).post('/tweet/create-tweet')
                                               .set('Authorization' , token)
                                                // .set('Cookie' , res1.headers['set-cookie'] )
                                                .send(data1);


            const lenDatabaseTweetsX = await tb_tweet.countDocuments();
            const result = await tb_tweet.findOne({'title' : 'User X'});
            expect(lenDatabaseTweetsX).toBe(1); //on signing up length of collection should increase by one

            expect(result.title).toEqual(data1.title); //fetching data from database and matching with input data
            expect(result.bodyText).toEqual(data1.bodyText);
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('userId');
        
        });


       
    })

    describe('My tweet' , () =>{

        afterAll(async()=> {
            await tb_tokens.deleteMany({});
            await tb_user.deleteMany({});
            await tb_tweet.deleteMany({}); 
        })

        let token , dbUser;
        beforeAll(async()=> {
            const passwordstring = "testpassword2";
            const hashedPassword = await bcrypt.hash( passwordstring, 1);
            // console.log(hashedPassword);
            const mydata = new userSchema(
                {   
                    "username": "testuser2",
                    "email": "testemail2@mail.com",
                    "name": "test user",
                    "password": hashedPassword
                }
            );

            await tb_user.insertMany(mydata);



            // dbUser = await tb_user.findOne({username:});
            dbUser = await tb_user.findOne({username:'testuser2'});
            

            // console.log(dbUser);
            token = jwt.sign({
                email:mydata.email ,
                username: mydata.username, 
                name:mydata.name ,
                _id: dbUser._id, 
                creationTime: new Date()
            }, "THISISAPRIVATEKEY");

            const userObject = new tb_tokens({
                userId : dbUser._id,
                tokens: token
            });
            tb_tokens.insertMany(userObject);


            // dbUser.token = token; 
            // const userToUpdate = new User(dbUser);
            // console.log(userToUpdate);
            // await userSchema.findOneAndUpdate({_id: dbUser._id} , userToUpdate);
        });


        // afterAll(async() => {
        //     await tb_tweet.deleteMany({});
        //     await tb_tokens.deleteMany({});
        // })


        test('User X should be able to read his tweets' , async()=>{
            // const creationDatetime = new Date();

            const data1 = {
                'title':'User X', 
                'bodyText':'Helloworld i am tester 1',
                'userId':dbUser._id,
                'creationDatetime': new Date()

            }
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // const creationDatetime1 = new Date();

            const data2 = {
                'title':'User Z', 
                'bodyText':'Helloworld i am tester 1',
                'userId':dbUser._id,
                'creationDatetime':new Date()

            }


            const tweetData = new tb_tweet(data1);
            const tweetData1 = new tb_tweet(data2);
            await tb_tweet.insertMany([tweetData , tweetData1]);

            const response = await request(app).get('/tweet/my-tweets')
                                               .set('Authorization' , token);

            expect(response.body.data.length).toBe(2);
            var check = (response.body.data[0].creationDatetime) > (response.body.data[1].creationDatetime);
            expect(check).toBeTruthy();

            // console.log(ObjectId(response.body.data[0].userId));
            // console.log(tweetData1.userId); 
            expect(ObjectId(response.body.data[0].userId)).toEqual(tweetData1.userId);
            expect(ObjectId(response.body.data[1].userId)).toEqual(tweetData.userId);



        })

    })


    describe('All tweets' , () =>{

        let token , dbUser , dbUser1 , token1;
        beforeAll(async()=> {
            const passwordstring = "testpassword";
            const passwordstring1 = "testpassword1"; 
            const hashedPassword = await bcrypt.hash( passwordstring, 1);
            const hashedPassword1 = await bcrypt.hash( passwordstring1, 1);
            // console.log(hashedPassword);
            const mydata = new userSchema(
                {   
                    "username": "testuser",
                    "email": "testemail@mail.com",
                    "name": "test user",
                    "password": hashedPassword
                }
            );


            const mydata1 = new userSchema(
                {   
                    "username": "testuser1",
                    "email": "testemail1@mail.com",
                    "name": "test user 1",
                    "password": hashedPassword1
                }
            );


            await tb_user.insertMany([mydata1 , mydata]);



            // dbUser = await tb_user.findOne({username:});
            dbUser = await tb_user.findOne({username:'testuser'});
            dbUser1 = await tb_user.findOne({username:'testuser1'})
            

            // console.log(dbUser);
            token = jwt.sign({
                email:mydata.email ,
                username: mydata.username, 
                name:mydata.name ,
                _id: dbUser._id,
                creationTime:new Date()
            }, "THISISAPRIVATEKEY");


            const userObject = new tb_tokens({
                userId : dbUser._id,
                tokens: token
            });
            tb_tokens.insertMany(userObject);


            token1 = jwt.sign({
                email:mydata1.email ,
                username: mydata1.username, 
                name:mydata1.name ,
                _id: dbUser1._id, 
                creationTime: new Date()
            }, "THISISAPRIVATEKEY");

            const userObject1 = new tb_tokens({
                userId : dbUser1._id,
                tokens: token1
            });
            tb_tokens.insertMany(userObject1);



            // dbUser.token = token; 
            // dbUser1.token = token1;
            // const userToUpdate = new User(dbUser);
            // const userToUpdate1 = new User(dbUser1);
            // console.log(userToUpdate);
            // await userSchema.findOneAndUpdate({_id: dbUser._id} , userToUpdate);
            // await userSchema.findOneAndUpdate({_id: dbUser1._id} , userToUpdate1);
        });


        afterAll(async() => {
            await tb_user.deleteMany({});
            await tb_tokens.deleteMany({});
            await tb_tweet.deleteMany({}); 
        })


        test('Second user should be able to read tweets of all' , async()=>{
            const data = {
                'title':'User X', 
                'bodyText':'Helloworld i am tester 1',
                'userId':dbUser._id,
                'creationDatetime':new Date()

            }
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const data1 = {
                'title':'User Z', 
                'bodyText':'Helloworld i am tester 2',
                'userId':dbUser1._id,
                'creationDatetime':new Date()

            }


            const tweetData = new tb_tweet(data);
            const tweetData1 = new tb_tweet(data1);
            await tb_tweet.insertMany([tweetData , tweetData1]);


            ///checking tweet feeds when second user is logged in 
            const response = await request(app).get('/tweet/feed')
                                               .set('Authorization' , token1)
                                               .expect(200);


            //checking the length of data array sent in the response (Should be 2)
            expect(response.body.data.length).toBe(2);


            //checkihg the chronological order of tweets
            expect(ObjectId(response.body.data[0].userId)).toEqual(tweetData1.userId);
            expect(ObjectId(response.body.data[1].userId)).toEqual(tweetData.userId);

        });
    });


    describe('Logout' , ()=> {
            
        beforeAll(async()=>{
            await tb_tokens.deleteMany({}); 
            await tb_user.deleteMany({});
            await tb_tweet.deleteMany({});
        })


        afterAll(async() => {
            await tb_user.deleteMany({});
            await tb_tokens.deleteMany({});

        })
        let token , dbUser;
        beforeAll(async()=> {
            const passwordstring = "John1234";
            const hashedPassword = await bcrypt.hash( passwordstring, 1);
            // console.log(hashedPassword);
            const mydata = new userSchema(
                {   
                    "username": "john1234",
                    "email": "john1234@mail.com",
                    "name": "John",
                    "password": hashedPassword
                }
            );

            await tb_user.insertMany(mydata);
            

            // dbUser = await tb_user.findOne({username:});
            dbUser = await tb_user.findOne({username:'john1234'});
            

            // console.log(dbUser);
            token = jwt.sign({
                email:mydata.email ,
                username: mydata.username, 
                name:mydata.name ,
                _id: dbUser._id,
                creationTime: new Date()
            }, "THISISAPRIVATEKEY");

            const userObject = new tb_tokens({
                userId : dbUser._id,
                tokens: token
            });
            tb_tokens.insertMany(userObject);
            // console.log(userObject);



            // const userToUpdate = new User(dbUser);
            // console.log(userToUpdate);
            // await userSchema.findOneAndUpdate({_id: dbUser._id} , userToUpdate);

        })


        // afterAll(async() => {
        //     await tb_user.deleteMany({});
        //     await tb_tokens.deleteMany({});
        // })
        it('logout test' , async()=>{
            const response = await request(app).post('/auth/logout')
                                               .set('Authorization', token)
                                               .expect(200);
            // console.log(response.headers);
            // const fetchedUser = await tb_user.findById({_id:dbUser._id});
            // expect(fetchedUser.token).toBeNull();
            const numberOfTokens = await tb_tokens.countDocuments();
            expect(numberOfTokens).toBe(0);
        })

    })


    describe('Logout from all devices' , ()=>{


        afterAll(async() => {
            await tb_user.deleteMany({});
            await tb_tokens.deleteMany({});

        })

        // beforeAll(async()=>{
        //     await tb_tokens.deleteMany({}); 
        //     await tb_user.deleteMany({});
        //     await tb_tweet.deleteMany({});
        // })
        let token , dbUser , token2;
        beforeAll(async()=> {
            const passwordstring = "John1234";
            const hashedPassword = await bcrypt.hash( passwordstring, 1);
            // console.log(hashedPassword);
            const mydata = new userSchema(
                {   
                    "username": "john1234",
                    "email": "john1234@mail.com",
                    "name": "John",
                    "password": hashedPassword
                }
            );

            await tb_user.insertMany(mydata);


            // dbUser = await tb_user.findOne({username:});
            dbUser = await tb_user.findOne({username:'john1234'});
            

            // console.log(dbUser);
            token = jwt.sign({
                email:mydata.email ,
                username: mydata.username, 
                name:mydata.name ,
                _id: dbUser._id,
                creationTime: new Date()
            }, "THISISAPRIVATEKEY");

            const userObject = new tb_tokens({
                userId : dbUser._id,
                tokens: token
            });
            tb_tokens.insertMany(userObject);


            await new Promise((resolve) => setTimeout(resolve, 1000));

            token2 = jwt.sign({
                email:mydata.email ,
                username: mydata.username, 
                name:mydata.name ,
                _id: dbUser._id, 
                creationTime : new Date()
            }, "THISISAPRIVATEKEY");

            const userObject1 = new tb_tokens({
                userId : dbUser._id,
                tokens: token2
            });
            tb_tokens.insertMany(userObject1);

        });
        test('Should log out from all devices' , async()=>{
            const response = await request(app).post('/auth/logout_from_all_devices')
                                                .set('Authorization' , token)

            // console.log(response);

            const numberOfDocs = await tb_tokens.countDocuments();
            expect(numberOfDocs).toBe(0);
        })
    })
});