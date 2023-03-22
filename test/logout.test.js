const request = require('supertest');
const app = require('../index'); // assuming this is your Express app
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const db = require('../db');
const {logoutFromAllDevices } = require('../Models/User');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({_id: String}, {strict: false});
const SessionModel = mongoose.model('sessions', sessionSchema, 'sessions');

describe('logoutFromAllDevices', () => {
  let mongoServer;
  let db;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri ="mongodb://0.0.0.0:27017/TwitterDB" ;
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = mongoose.connection;
  });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

  beforeEach(async () => {
    // clear the session collection before each test
    await SessionModel.deleteMany({});
  });

  test('should logout user from all devices', async () => {
    // create a sample user object and session object
    const userId = '123';
    const sessionId1 = 'session-1';
    const sessionId2 = 'session-2';
    const session1 = { _id: sessionId1, session: { user: { userId } } };
    const session2 = { _id: sessionId2, session: { user: { userId } } };
    await SessionModel.create([session1, session2]);

    // call the logoutFromAllDevices function
    const result = await logoutFromAllDevices(userId);

    // check if the function returns the expected result
    expect(result.ok).toBe(1);
    expect(result.deletedCount).toBe(2);
  });
});
