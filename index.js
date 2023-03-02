// Package imports
const express = require('express');
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session);



// Controllers
const AuthRouter = require('./Controllers/Auth');
const TweetsRouter = require('./Controllers/Tweet');

const app = express();

const store = new MongoDbSession({
    uri: "mongodb://0.0.0.0:27017/TwitterDB",
    collection: 'tb_sessions'
})

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'abcdefg',
    resave: false,
    saveUninitialized: false,
    store: store
}))

// Routes
app.use('/auth', AuthRouter);
app.use('/tweet', TweetsRouter);


app.get('/', (req, res) => {
    res.send({
        status: 200,
        message: "Welcome"
    })
})

module.exports = app;
