const request = require('supertest');
const app = require('../index');
const db = require('../db');
const { isAuth } = require('../Utils/Auth');
// jest.setTimeout(40000);

//tweet check same as sign up just check the ß_id property response

describe('Check if email has a correct format' , ()=>{
it('email is not present' , async()=>{
    const data = {
        "name": "John",
        "username": "john12",
        "email":"",
        "password": "John1234"
    }
    
    const response = await request(app).post('/auth/register')
                                        .set('Content-type' , 'application/json')
                                        .send(data);
    console.log(JSON.stringify(response.body));
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
    console.log(JSON.stringify(response.body));
    expect(response.body.status).toBe(401);
    expect(response.body).toHaveProperty('message');

});

});


describe('Check if name has a correct format' , ()=>{
    it('name is not present' , async()=>{
        const data = {
            "name": "",
            "username": "john124",
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
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401);
        expect(response.body).toHaveProperty('message');

    });
});


describe('Check if username has a correct format' , ()=>{
    it('username is not present' , async()=>{
        const data = {
            "name": "John",
            "username": "",
            "email": "john34@mail.com",
            "password": "John1234"
        }
        
        const response = await request(app).post('/auth/register')
                                        .set('Content-type' , 'application/json')
                                        .send(data);
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401 );
        expect(response.body).toHaveProperty('messsssage' );

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
        console.log(JSON.stringify(response.body));
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
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

});


describe('Check if password has a correct format' , ()=>{

    // it('password end point not correct')
    it('password is not present' , async()=>{
        const data = {
            "name": "John",
            "username": "John123",
            "email": "john34@mail.com",
            "password": ""
        }
        
        const response = await request(app).post('/auth/register')
                                        .set('Content-type' , 'application/json')
                                        .send(data);
        console.log(JSON.stringify(response.body));
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
        console.log(JSON.stringify(response.body));
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
        console.log(JSON.stringify(response.body));
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
        console.log(JSON.stringify(response.body));
        expect(response.body.status).toBe(401);
        expect(response.body).toHaveProperty('message');

    });

});




let res , res1 ; 
describe('User X Sign Up functionality check' , ()=> {
       
    test('User X should be able to register and login if credentials are valid' , async()=>{
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

});

describe('User X Sign In functionality check ', ()=>{
    it('User X should be able to sign in with valid credentials' , async()=>{
        res1 = await request(app).post('/auth/login')
                                 .set('Content-type', 'application/json')
                                 .send({
                                        'loginId':"john1353",
                                        'password':'John1234'
                                 }).expect(200);
        expect(res1.body).toHaveProperty('message');
        expect(res1.body.data).toHaveProperty('email');
        expect(res1.body.data).toHaveProperty('_id');
        expect(res1.body.data).toHaveProperty('username');
    })
}); 





let response;
describe('User X Create Tweeet functionality' , ()=>{
    test('user X should be able to create a new tweet' , async() =>{
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
})

let res7;
describe('User X and User Y Logout functionality' , ()=>{
    it('User should be able to logout successfully' , async()=>{
        res7 = await request(app).post('/auth/logout')
                           .set('Cookie' , res1.headers['set-cookie'])
                           .expect(200);
        expect(res7.body).toHaveProperty('message');
        expect(res7.body.data).toHaveProperty('email');
        // expect(res7.body.data).toHaveProperty('message');

    })
})

let res2 , res3 , res4;
describe('User Y should be able to sign up , sign in and create a tweet with valid credentials' , ()=>{
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
});

let res5;
describe('User Y should be able to see feed of all the tweeters' , ()=>  {
    it('should get all tweets and should be stored in chronological order' , async()=>{

        res5 = await request(app).get('/tweet/feed')
                    .set('Cookie' , res3.headers['set-cookie'])
                    .set('Content-type' , 'application/json')
                    .expect(200)

        let ans = (res5.body.data[0].creationDatetime) > (res5.body.data[1].creationDatetime)
        expect(ans).toBe(true);
        expect(res5.body.data.length).toBe(2);
        console.log(res5.body.data.length);
                    
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
        console.log(res6.body.data.length);
    })
});



        
                                    
        // console.log(console.dir(res.headers))

    
    


