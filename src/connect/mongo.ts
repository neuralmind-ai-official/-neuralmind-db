import { MongoClient } from "mongodb";

const main = async (connectionString, dbName) => {
  try {
    const client = new MongoClient(connectionString);
    const database = client.db(dbName);
    return database;
  } catch (error) {
    console.log(error);
  }
};

export default main;
