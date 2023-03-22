const express = require('express');
const tweetsRouter = express.Router();

const Tweets = require('../Models/Tweet');
const User = require('../Models/User');
const { isAuth } = require('../Utils/Auth');

tweetsRouter.post('/create-tweet',isAuth, async (req, res) => {

    const { title, bodyText } = req.body;
    console.log(req.user._id);
    const userId = req.user._id;

    if(!title || !bodyText) {
        return res.send({
            status: 500,
            message: "Parameters missing"
        })
    }

    if(!userId) {
        return res.send({
            status: 401,
            message: "Invalid UserId"
        })
    }

    if(typeof(title) !== 'string' || typeof(bodyText) !== 'string') {
        return res.send({
            status: 400,
            message: "Title and BodyText should be only text"
        })
    }

    if(title.length > 200 || bodyText > 1000) {
        return res.send({
            status: 401,
            message: "Title and bodytext too long. Allowed chars for title is 200 and bodytext is 1000."
        })
    }

    const creationDatetime = new Date();

    const Tweet = new Tweets({title, bodyText, creationDatetime, userId});

    try {
        const dbTweet = await Tweet.createTweet();

        return res.send({
            status: 200,
            message: "Tweet created Successfully.",
            data: dbTweet
        })
    }
    catch(err) {
        return res.send({
            status: 404,
            message: "Database error",
            error: err
        })
    }
})


tweetsRouter.get('/feed', isAuth, async (req, res) => {

    const offset = req.query.offset || 0;
    const userId = req.user._id;

    try {

        //const followingUserIds = await getFeedFollowingList(userId);

        const dbTweets = await Tweets.getTweets2(offset);

        return res.send({
            status: 200,
            message: "Read Successful",
            data: dbTweets
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Read Unsuccessful",
            error: err
        })
    }
})

tweetsRouter.get('/my-tweets', isAuth, async (req, res) => {

    const offset = req.query.offset || 0;
    const userId = req.user._id;

    if(!userId) {
        return res.send({
            status: 400,
            message: "User not found"
        })
    }

    try {
        const dbTweets = await Tweets.getMyTweets(offset, userId);

        return res.send({
            status: 200,
            message: "Read Successful",
            data: dbTweets
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Internal error. Please try again",
            error: err
        })
    }
})



module.exports = tweetsRouter;