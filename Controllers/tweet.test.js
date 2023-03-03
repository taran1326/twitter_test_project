const request = require('supertest');
const app = require('../index');
const db = require('../db');
const { isAuth } = require('../Utils/Auth');
// jest.setTimeout(40000);

//tweet check same as sign up just check the ß_id property response


describe('Sign Up , Login , Create-tweet , explore feed , my-tweet functionality check' , ()=> {
    let res , res1 , res2, res3 , res4 ,res5 ,response;    

    it('catch wrong password format (NOT ALPHANUMERIC) and give 401 code' , async()=>{
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

    });
    it('catch wrong password format (PASSWORD LENGTH LONGER THAN PERMISSED) should ,give 401 code' , async()=>{
        const data = {
            "name": "John",
            "username": "john123",
            "email": "john34@mail.com",
            "password": "John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234John1234"
        }
        
        const response = await request(app).post('/auth/register')
                                           .set('Content-type' , 'application/json')
                                           .send(data);
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401);
        expect(response.body).toHaveProperty('message');

    });
    it('catch wrong password format (PASSWORD LENGTH SHORTER THAN PERMISSED) and give 401 code' , async()=>{
        const data = {
            "name": "John",
            "username": "john123",
            "email": "john34@mail.com",
            "password": "Joh"
        }
        
        const response = await request(app).post('/auth/register')
                                           .set('Content-type' , 'application/json')
                                           .send(data);
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401);
        expect(response.body).toHaveProperty('message');

    });


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

    });

    it('wrong username format (USERNAME LENGTH GREATER THAN REQUIRED) , should give 401 code' , async()=>{
        const data = {
            "name":"John",
            "username": "john1234567890john1234567890john1234567890john123456789",
            "email": "john34@mail.com",
            "password": "John1234"
        }
        const response = await request(app).post('/auth/register')
                                           .set('Content-type' , 'application/json')
                                           .send(data);
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });


    it('should be able to register user 1' , async()=>{
        const data = {
            "name": "John",
            "username": "john1353",
            "email": "john3152@mail.com",
            "password": "John1234"
        }


        JSON.stringify(data);
        res = await request(app).post('/auth/register')
                                .set('Content-type', 'application/json')
                                .send(data)


        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('username');
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('email');
        
    });

    it('should be able to login user 1' , async()=>{
        res1 = await request(app).post('/auth/login')
                                 .set('Content-type', 'application/json')
                                 .send({
                                        'loginId':"john1353",
                                        'password':'John1234'
                                 });
    })

    it('should be able to create a new tweet' , async() =>{
        const creationDatetime = new Date();
        console.log(console.dir(res1.body));
        const data1 = {
            'title':'Hello world!', 
            'bodyText':'Helloworld i am tester',
            'userId':res1.body.data._id,
            'creationDatetime':creationDatetime

        }
        JSON.stringify(data1);

        response = await request(app).post('/tweet/create-tweet')
                                        //    .set(isAuth , true)
                                            .set('Cookie' , res1.headers['set-cookie'] )
                                            .send(data1);
        
        console.log(console.dir(response.body));

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('userId');
        
    });


    it('should be able to register , sign in and (USER 2)' , async() =>{
        const data2 = {
            "name": "Taran",
            "username": "taran1326",
            "email": "taran1326@mail.com",
            "password": "Taran1326"
        }
        
        JSON.stringify(data2);
        res2 = await request(app).post('/auth/register').set('Content-type', 'application/json')
                                             .send(data2);
        res3 = await request(app).post('/auth/login').set('Content-type', 'application/json')
                                          .send({
                                             'loginId':"taran1326",
                                             'password':'Taran1326'
                                          });
                                    
        // console.log(console.dir(res.headers));
        const creationDatetime1 = new Date();
        const data3 = {
            'title':'Hello world!', 
            'bodyText':'Helloworld i am tester',
            'userId':res3.body.data._id,
            'creationDatetime':creationDatetime1

        }
        JSON.stringify(data3);
        res4 = await request(app).post('/tweet/create-tweet')
                                        //    .set(isAuth , true)
                                            .set('Cookie' , res3.headers['set-cookie'] )
                                            .send(data3);
        // console.log(JSON.stringify(response.body));
        console.log(console.dir(res4.body));
        expect(res4.statusCode).toBe(200);
        expect(res4.body.data).toHaveProperty('userId');
    })

    it('should get all tweets and should be stored in chronological order' , async()=>{



        //redundant code

        res5 = await request(app).get('/tweet/feed')
                    .set('Cookie' , res3.headers['set-cookie'])
                    .set('Content-type' , 'application/json')
                    .expect(200)

    let ans = (res5.body.data[0].creationDatetime) > (res5.body.data[1].creationDatetime)
    expect(ans).toBe(true);
    expect(res5.body.data.length).toBe(2);
    console.log(res5.body.data.length);
                    
    })
    it('should be able to see my tweets' , async()=>{
        const res6 = await request(app).get('/tweet/my-tweets')
                                        .set('Content-type' , 'application/json')
                                        .set('Cookie' , res3.headers['set-cookie'])
                                        .expect(200)
        expect(res6.body.data.length).toBe(1);
        console.log(res6.body.data.length);
    })

})

