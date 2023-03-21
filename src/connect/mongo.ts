// The Sequelize ORM is primarily designed for working with relational databases, whereas MongoDB is a NoSQL document-oriented database. 
// As a result, using Sequelize with MongoDB is not recommended. Instead, you can use a MongoDB-specific ORM like Mongoose to work with MongoDB.

import mongodb from '../interfaces/mongo';
import { connect, disconnect, Schema, model } from 'mongoose';

const mySchema = new Schema({
  // define your schema here
});

const MyModel = model('MyModel', mySchema);

const main = async () => {
  try {
    await connect(process.env.mongodb);
    console.log('MongoDB Connected!');
  } catch (error) {
    console.log(error);
  }
};

const Mydisconnect = async () => {
  try {
    await disconnect();
  } catch (error) {
    console.log(error);
  }
};

export default main;
