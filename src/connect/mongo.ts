// The Sequelize ORM is primarily designed for working with relational databases, whereas MongoDB is a NoSQL document-oriented database. 
// As a result, using Sequelize with MongoDB is not recommended. Instead, you can use a MongoDB-specific ORM like Mongoose to work with MongoDB.

import { MongoClient } from 'mongodb';
import { MongoClientOptions } from '@types/mongodb';
import mongodb from '../interfaces/mongo';

const connectMongoDB = async (payload: mongodb) => {
  try {
    const url = `mongodb://${payload.username}:${payload.password}@${payload.host}:${payload.port}/${payload.database}`;

    const options: MongoClientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const client = await MongoClient.connect(url, options);
    const database = client.db(payload.database);

    return database;
  } catch (error) {
    return false;
  }
};

export default connectMongoDB;