const request = require('supertest');
const {app , store} = require('../index');
const db = require('../db');
const {connect} = require('../db');
const tb_tweet = require('../Schemas/Tweets');
const tb_user= require('../Schemas/User');
const bcrypt = require('bcrypt');
const mockSession = require('mock-session')


const userSchema = require('../Schemas/User')

//tweet check same as sign up just check the ß_id property response

describe('Database test suite' , () => {
    // connecting to database before each test and setting up collections.
    beforeAll( async () => {
        await connect();
    })

    //clearing up all the documents in collections (data in database)
    beforeAll(async () => {
    //Session deletion before every iteration
        await store.clear();
    // await mongoose.connection.close();
     })

    
    describe('Check if email has a correct format' , ()=>{
        afterAll(async () =>{
            await tb_user.deleteMany({});
        })
        it('email is not present' , async()=>{
            const data = {
                "name": "goodenough",
                "username": "john12",
                "password": "John1234"
            }
            
            const response = await request(app).post('/auth/register')
                                                .set('Content-type' , 'application/json')
                                                .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });
        it('email has wrong format (missing @ and .)' , async()=>{
            const data = {
                "name": "John",
                "username": "john12",
                "email": "john34mailcom",
                "password": "John1234"
            }
            
            const response = await request(app).post('/auth/register')
                                                .set('Content-type' , 'application/json')
                                                .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });

    });


    describe('Check if name has a correct format' , ()=>{
        afterAll(async () =>{
            await tb_user.deleteMany({});
        })
        it('name is not present' , async()=>{
            const data = {
                "username": "john124",
                "email": "john34@mail.com",
                "password": "John1234"
            }
            
            const response = await request(app).post('/auth/register')
                                                .set('Content-type' , 'application/json')
                                                .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });
        it('NAME LENGTH LONGER THAN 100 CHARACTERS' , async()=>{
            const data = {
                "name": "JohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohnJohn",
                "username": "john12",
                "email": "john34@mail.com",
                "password": "John1234"
            }
            
            const response = await request(app).post('/auth/register')
                                                .set('Content-type' , 'application/json')
                                                .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });

    });


    describe('Check if username has a correct format' , ()=>{
        afterAll(async () =>{
            await tb_user.deleteMany({});
        })
        it('username is not present' , async()=>{
            const data = {
                "name": "John",
                "email": "harshit@mail.com",
                "password": "John1234"
            }
            
            const response = await request(app).post('/auth/register')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401 );
            expect(response.body).toHaveProperty('message' );

        });

        it('USERNAME IS EQUAL TO EMAIL' , async()=> {
            const data = {
                "name": "John",
                "username": "john34@mail.com",
                "email": "john34@mail.com",
                "password": "John1234" 
            }
        })

        it('USERNAME LENGTH SMALLER THAN 3' , async()=>{
            const data = {
                "name": "John",
                "username": "jo",
                "email": "john34@mail.com",
                "password": "John1234"
            }
            
            const response = await request(app).post('/auth/register')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });

        it('USERNAME LENGTH GREATER THAN 50' , async()=>{
            const data = {
                "name":"John",
                "username": "john1234567890john1234567890john1234567890john123456789",
                "email": "john34@mail.com",
                "password": "John1234"
            }
            const response = await request(app).post('/auth/register')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        

    });


    describe('Check if password has a correct format' , ()=>{
        afterAll(async () =>{
            await tb_user.deleteMany({});
        })

        // it('password end point not correct')
        it('password is not present' , async()=>{
            const data = {
                "name": "John",
                "username": "John123",
                "email": "john34@mail.com",

            }
            
            const response = await request(app).post('/auth/register')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });

        it('PASSWORD NOT ALPHANUMERIC' , async()=>{
            const data = {
                "name": "John",
                "username": "john123",
                "email": "john34@mail.com",
                "password": "John@1234"
            }
            
            const response = await request(app).post('/auth/register')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });
        it('PASSWORD LENGTH LONGER THAN 200 CHARACTERS' , async()=>{
            const data = {
                "name": "John",
                "username": "john123",
                "email": "john34@mail.com",
                "password": "John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234"
            }
            
            const response = await request(app).post('/auth/register')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });
        it('PASSWORD LENGTH SHORTER THAN 6 CHARACTERS' , async()=>{
            const data = {
                "name": "John",
                "username": "john123",
                "email": "john34@mail.com",
                "password": "Joh"
            }
            
            const response = await request(app).post('/auth/register')
                                            .set('Content-type' , 'application/json')
                                            .send(data);
            // console.log(JSON.stringify(response.body));
            expect(response.body.status).toBe(401);
            expect(response.body).toHaveProperty('message');

        });

    });






    // we are clearing the collection containing (old) tweets and users for next set of tests.
    beforeAll(async () =>{
        await tb_tweet.deleteMany({});
        await tb_user.deleteMany({});
    })
    let res , res1 ; 

    describe('User X Sign Up functionality check' , ()=> {
        const data = {
            "name": "John",
            "username": "john1353",
            "email": "john3152@mail.com",
            "password": "John1234"
        }
        //we are checking if on sending a request we are gettogn adequate response or not.
        test('User X should be able to register and login if credentials are valid , (response check)' , async()=>{

            jest.setTimeout(10000);
            res = await request(app).post('/auth/register')
                                    .set('Content-type', 'application/json')
                                    .send(data) 
            
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('username');
            expect(res.body.data).toHaveProperty('name');
            expect(res.body.data).toHaveProperty('email');
            expect(res.body.data.email).toBe("john3152@mail.com");
            expect(res.body.data.username).toBe("john1353");
            expect(res.body.data.name).toBe("John");
            
        });

        //test : - 
        //length of collection should increase on signing up new user 
        //the user credentials should match in inout and in database

        it('finding user in database (database check)' , async()=>{
            const num = await tb_user.countDocuments();
            expect(num).toBe(1);
            
            const result = await tb_user.findOne({'name':'John'});
            expect(result.name).toEqual(data.name);
            expect(result.email).toEqual(data.email);
            expect(result.username).toEqual(data.username);


            const isMatch = await bcrypt.compare(data.password ,result.password );
            expect(isMatch).toBe(true);
        }) 

        //we are passing the data with same email.
        it('should give an error if the user exists (same email)' , async() => {
            const data = {
                "name": "John",
                "username": "john1355",
                "email": "john3152@mail.com",
                "password": "John1234"
            }
            const response = await request(app).post('/auth/register')
                                    .set('Content-type', 'application/json')
                                    .send(data)
                                    
            expect(response.body.status).toBe(401);
        })
        //we are passing the data with same username
        it('should give an error if the user exists (same username)' , async() => {

            const data = {
                "name": "John",
                "username": "john1353",
                "email": "john3156@mail.com",
                "password": "John1234"
            }
            const response = await request(app).post('/auth/register')
                                    .set('Content-type', 'application/json')
                                    .send(data)
                                    
            expect(response.body.status).toBe(401);
        })

        tb_user.deleteOne({"name":"John"});
    });




    describe('User X Sign In functionality check ', ()=>{
        afterAll(async()=>{
            tb_user.deleteMany({});
            tb_tweet.deleteMany({});
        })



        //passsing user data without password field
        it('should give an error (500 code) if password missing' , async() => {
            const response1 = await request(app).post('/auth/login')
                                    .set('Content-type', 'application/json')
                                    .send({
                                            'loginId':"john1353"
                                    })
            expect(response1.body.status).toBe(500);
        })

        //passing userdata without loginID field
        it('should give an error (500 code) if loginID missing' , async() => {
            const errorSignInLoginID = await request(app).post('/auth/login')
                                    .set('Content-type', 'application/json')
                                    .send({
                                            'password':'John1234'
                                    })
            expect(errorSignInLoginID.body.status).toBe(500);

        })
        //passing user data which was not registered before
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
            

        })


        



    }); 

    let response;
    describe('User X Create Tweeet functionality' , ()=>{

        // beforeEach(done => {
        //     setTimeout(() => {
        //       done();
        //     }, 2000); // delay for 2 seconds
        // });
        const passwordstring = "Rajat3592";
        var hashedPassword;
        var id , req;
        beforeAll(async()=>{
            
            hashedPassword = await bcrypt.hash( passwordstring, 1);
            console.log(hashedPassword);
            const mydata = new userSchema(
                {   
                    "username": "Rajat3592",
                    "email": "rajat3592@mail.com",
                    "name": "Rajat",
                    "password": hashedPassword
    
                }
            );

            id = tb_user.findOne({"name":"Rajat"})._id;


        })

        test('should give an error if bodyText is missing' , async()=>{
            const creationDatetime = new Date();

            const data1 = {
                'title':'User X', 
                'userId': id,
                'creationDatetime':creationDatetime

            }

            const response = await request(app).post('/tweet/create-tweet')
                                            //    .set(isAuth , true)
                                                .set('Cookie' , res1.headers['set-cookie'] )
                                                .send(data1);

            expect(response.body.status).toBe(500);

        })

        test('should give an error if title is missing' , async()=>{
            const creationDatetime = new Date();

            const data1 = {
                'bodyText' : 'hello world I am tester testing', 
                'userId':id,
                'creationDatetime':creationDatetime

            }

            const response = await request(app).post('/tweet/create-tweet')
                                            //    .set(isAuth , true)
                                                .set('Cookie' , res1.headers['set-cookie'] )
                                                .send(data1);

            expect(response.body.status).toBe(500);
            
        })


        test('user X should be able to create a new tweet' , async() =>{

            const creationDatetime = new Date();

            const data1 = {
                'title':'User X', 
                'bodyText':'Helloworld i am tester 1',
                'userId':id,
                'creationDatetime':creationDatetime

            }
            JSON.stringify(data1)

            response = await request(app).post('/tweet/create-tweet')
                                            //    .set(isAuth , true)
                                                .set('Cookie' , res1.headers['set-cookie'] )
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

    let res7;
    describe('User X Logout functionality' , ()=>{
        it('User should be able to logout successfully' , async()=>{
            
            res7 = await request(app).post('/auth/logout')
                            .set('Cookie' , res1.headers['set-cookie'])
                            .expect(200);

            expect(res7.body).toHaveProperty('message');
            expect(res7.body.data).toHaveProperty('email');
            // expect(res7.body.data).toHaveProperty('message');

        })
        test('logout unsuccesful if user x not logged in' , async()=> {
            const response = await request(app).post('/auth/logout')
            // console.log(console.dir(response.body));
            expect(response.body.status).toBe(404);
        })
    })

    let res2 , res3 , res4;
    describe('User Y should be able to sign up , sign in and create a tweet with valid credentials' , ()=>{
        beforeAll(done => {
            setTimeout(() => {
              done();
            }, 2000); // delay for 2 seconds
        }); // this is done as it creates a gap of 2 seconds between first and secnd tweet to check in future tests if the tweets are displayed in chronological order or not.
        it('User Y should be able to sign up' , async() =>{
            const data2 = {
                "name": "Taran",
                "username": "taran1326",
                "email": "taran1326@mail.com",
                "password": "Taran1326"
            }
            
            JSON.stringify(data2);
            res2 = await request(app).post('/auth/register').set('Content-type', 'application/json')
                                                .send(data2);
        });

        it('User Y should be able to sign in', async()=>{
            res3 = await request(app).post('/auth/login')
                                    .set('Content-type', 'application/json')
                                    .send({
                                            'loginId':"taran1326",
                                            'password':'Taran1326'
                                        });
        });

        it('User Y should be able to create a tweet successfully' , async()=>{
            const creationDatetime1 = new Date();
            const data3 = {
                'title':'User Y', 
                'bodyText':'Helloworld i am tester 2',
                'userId':res3.body.data._id,
                'creationDatetime':creationDatetime1

            }
            JSON.stringify(data3);
            res4 = await request(app).post('/tweet/create-tweet')
                                            //    .set(isAuth , true)
                                                .set('Cookie' , res3.headers['set-cookie'] )
                                                .send(data3);
            // console.log(JSON.stringify(response.body));

            // console.log(console.dir(res4.body));


            const fetchedUserY = await tb_tweet.findOne({'title' : 'User Y'});
            expect(res4.statusCode).toBe(200);
            expect(res4.body.data).toHaveProperty('userId');
            expect(fetchedUserY.bodyText).toEqual(data3.bodyText); //matching the body text by fetching the user from database and the input user object , this will work only if database is created.
        })


        test('tb_tweet collection should have 2 tweets now' , async()=>{
            const lenTweets = await tb_tweet.countDocuments();
            expect(lenTweets).toEqual(2);
        })
    });

    let res5;
    describe('User Y should be able to see feed of all the tweeters' , ()=>  {
        it('should get all tweets and should be stored in chronological order' , async()=>{

            res5 = await request(app).get('/tweet/feed')
                        .set('Cookie' , res3.headers['set-cookie'])
                        .set('Content-type' , 'application/json')
                        .expect(200)

            // console.log(console.dir(res5.body));
            let ans = (res5.body.data[0].creationDatetime) > (res5.body.data[1].creationDatetime)

            expect(res5.body.data.length).toBe(2);
            // console.log(res5.body.data.length);
                        
        })

        

    });


    let res6;
    describe('User Y should able to see his/her feed ' , ()=> {
        it('should be able to see my tweets' , async()=>{
            const res6 = await request(app).get('/tweet/my-tweets')
                                            .set('Content-type' , 'application/json')
                                            .set('Cookie' , res3.headers['set-cookie'])
                                            .expect(200)
            expect(res6.body.data.length).toBe(1);
            // console.log(res6.body.data.length);
        })
    });
});


        
                                    
//         // console.log(console.dir(res.headers))

    
    




