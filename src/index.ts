import { getDBByAPIKey, dbQuery } from "./apis/neuralmind";
import connectMySQL from "./connect/mysql";
import mysql from "./interfaces/mysql";
import connectPostgre from "./connect/postgre";
import postgre from "./interfaces/postgre";
import mongodb from "./interfaces/mongo";
import connectMongoDB from "./connect/mongo";

export default class NeuralmindDB {
  db: string = "";
  apiKey: string = "";
  connection: mysql | postgre | mongodb;
  dbFunc: any;

  constructor(db: string, apiKey: string, connection: mysql | postgre) {
    this.db = db;
    this.apiKey = apiKey;
    this.connection = connection;
  }

  // dialect dynamic
  async connect() {
    if (this.db === "mysql") {
      const connectResponse: any = await connectMySQL(this.connection as mysql);
      if (!connectResponse) {
        console.error("Connecting with MySQL server failed.");
        return;
      }
      this.dbFunc = connectResponse;

      return true;
    } else if (this.db === "postgres") {
      const connectResponse: any = await connectPostgre(
        this.connection as postgre
      );
      if (!connectResponse) {
        console.error("Connecting with PostgreSQL server failed.");
        return;
      }

      this.dbFunc = connectResponse;

      return true;
    } else if (this.db === "mongodb") {
      const connectResponse: any = await connectMongoDB(
        `mongodb+srv://${this.connection.username}:${this.connection.password}@${this.connection.host}`,
        this.connection.database
      );
      if (!connectResponse) {
        console.error("Connecting with MongoDB server failed.");
        return;
      }

      this.dbFunc = connectResponse;
      return true;
    } else {
      console.error("Invalid database type.");
      return false;
    }
  }

  // Get tables;
  async tables() {
    if (this.db === "mysql") {
      const [result, metaData] = await this.dbFunc.query(`SHOW TABLES`);
      const tables = result.map((value: any) => value[Object.keys(value)[0]]);
      return tables;
    } else if (this.db === "postgres") {
      const result = await this.dbFunc.query(
        "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';"
      );
      const tables = result[0].map((value: any) => value.tablename);

      return tables;
    } else if (this.db === "mongodb") {
      const collections = await this.dbFunc.listCollections().toArray();

      const tables = collections.map((collection: any) => collection.name);
      return tables;
    } else {
      console.error("Invalid database type.");
      return [];
    }
  }

  async generateDBSchema(tables = []) {
    if (tables.length === 0) tables = await this.tables();
    if (this.db === "mysql") {
      let schemas: string = "";
      for (let index = 0; index < tables.length; index++) {
        const table = tables[index];
        const [result, metaData] = await this.dbFunc.query(
          `SHOW CREATE TABLE ${table}`
        );
        if (result.length === 0) return;
        schemas += `\n Schema: ${result[0]["Create Table"]}`;
      }
      return schemas;
    } else if (this.db === "postgres") {
      let schemas: string = "";
      for (let index = 0; index < tables.length; index++) {
        const table = tables[index];
        const [result] = await this.dbFunc.query(
          `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name='${table}'`
        );
        schemas += `\n\nTable: ${table}\n`;
        for (const row of result) {
          schemas += `Column: ${row.column_name}, Type: ${row.data_type}\n`;
        }
      }

      return schemas;
    } else if (this.db === "mongodb") {
      let schemas: string = "";

      for (let index = 0; index < tables.length; index++) {
        const table = tables[index];
        const connection = this.dbFunc.collection(table);
        const result = await connection.find().toArray();
        schemas += `\n\nTable: ${table}\n`;
        if (result.length === 0) {
          schemas += `No data found in table ${table}\n`;
          continue;
        }
        const schemaKeys = Object.keys(result[0]);
        for (const key of schemaKeys) {
          schemas += `Column: ${key}, Type: ${typeof result[0][key]}\n`;
        }
      }

      return schemas;
    } else {
      console.error("Invalid database type.");
      return "";
    }
  }

  async run(query: string) {
    try {
      if (this.db === "mysql" || this.db == "postgres") {
        const [result, metaData] = await this.dbFunc.query(query);

        return result;
      } else if (this.db === "postgresql") {
        const result = await this.dbFunc.query(query);
        return result.rows;
      } else if (this.db === "mongodb") {
        const collection = query.split("db.")[1].split(".find")[0];

        const result = await eval(
          `this.dbFunc.collection('${collection}').find${
            query.split("db.")[1].split(".find")[1]
          }`
        ).toArray();

        return result;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * @param tables default empty array, and it will get all the table schema from the database
   * @param rules default empty array, and it will make sure every request satisfy some needs
   * @returns Boolean tells if the opperation is succcessfull or not
   */
  async sync(tables = [], rules = []) {
    try {
      const schemas =
        tables.length > 0
          ? await this.generateDBSchema(tables)
          : await this.generateDBSchema();

      const response: any = await getDBByAPIKey(this.apiKey, {
        schemas,
        rules,
      });

      //response.result contain the updated object
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   *
   * @param query End user query
   * @returns { string / false}
   */
  async query(query: string) {
    try {
      const response: any = await dbQuery({
        query,
        api_key: this.apiKey,
        db_type: this.db === "mongodb" ? "NoSQL" : this.db,
      });
      if (!response.response) return false;
      return response.response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
