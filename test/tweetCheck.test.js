
const mongoose = require('mongoose');
const Tweets = require('../Models/Tweet');
const {createTweet, getTweets2, getMyTweets} = require('../Models/Tweet')
const {TweetsSchema} = require('../Schemas/Tweets')
const ObjectId = require('mongodb').ObjectId;

describe('create tweet', () => {
  let db;

  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/TwitterDB';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = mongoose.connection;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await db.close();
  });

  beforeEach(async () => {
    await db.collection('tb_tweets').deleteMany({});
  });

  test('should create a new tweet , (/create-tweet)', async () => {
    // create a sample tweet object
    const tweetData = new Tweets({
      title: 'My First Tweet',
      bodyText: 'Hello world!',
      userId: mongoose.Types.ObjectId(123),
      creationDatetime: new Date()
    });

    // call the createTweet function
    const createdTweet = await tweetData.createTweet();

    const lenDatabaseTweetsX = await db.collection('tb_tweets').countDocuments();
    expect(lenDatabaseTweetsX).toBe(1);

    const firstTweet = await db.collection('tb_tweets').findOne({'title' : 'My First Tweet'});
    expect(firstTweet.title).toEqual(tweetData.title);
    expect(firstTweet.bodyText).toEqual(tweetData.bodyText);





    // check if the tweet was created successfully
    expect(createdTweet).toBeDefined();
    expect(createdTweet.title).toBe(tweetData.title);
    expect(createdTweet.bodyText).toBe(tweetData.bodyText);
    expect(createdTweet.userId).toBe(tweetData.userId);
    // expect(createdTweet.creationDatetime).toEqual(tweetData.creationDatetime);
  });


});


describe('get Tweets , (/feed)', ()=>{
  let db;

  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/TwitterDB';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = mongoose.connection;
  });


  // afterAll(async()=>{
  //   await db.collection('tb_tweets').deleteMany({});
  // })
  var userID1 , userID2 , userID3;
  beforeAll(async () => {
    userID1 = mongoose.Types.ObjectId(124);
    const tweet1 = new Tweets({
      title: 'Tweet 1',
      bodyText: 'This is the body of tweet 1',
      userId: userID1,
      creationDatetime: new Date(),
    });
  
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second
  
    userID2 = mongoose.Types.ObjectId(125);
    const tweet2 = new Tweets({
      title: 'Tweet 2',
      bodyText: 'This is the body of tweet 2',
      userId: userID2,
      creationDatetime: new Date(),
    });
  
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second
  
    const tweet3 = new Tweets({
      title: 'Tweet 3',
      bodyText: 'This is the body of tweet 3',
      userId: userID1,
      creationDatetime: new Date(),
    });
  
    await db.collection('tb_tweets').insertOne(tweet1);
    await db.collection('tb_tweets').insertOne(tweet2);
    await db.collection('tb_tweets').insertOne(tweet3);
  });
  

  // beforeEach(async () => {
  //   await db.collection('tb_tweets').deleteMany({});
  // })


  test('should return tweets from following users , (/my-tweets)', async () => {
    const offset = 0;
    // const followingUserIds = [userID1 , userID2];
    const result = await getTweets2(offset);

    expect(result).toHaveLength(3);
    expect(result[0].title).toBe('Tweet 3');
    expect(result[1].title).toBe('Tweet 2');
  });


  test('should return tweets from single user', async() => {
    const offset = 0;
    const result1 = await getMyTweets(offset , userID1);
    expect(result1).toHaveLength(2);
    expect(result1[0].title).toBe('Tweet 3');
    expect(result1[1].title).toBe('Tweet 1');
  })


});
