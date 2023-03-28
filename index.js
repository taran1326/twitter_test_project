// Package imports
const express = require('express');



// Controllers
const AuthRouter = require('./Controllers/Auth');
const TweetsRouter = require('./Controllers/Tweet');

const app = express();


// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


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
