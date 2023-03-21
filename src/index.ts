import { getDBByAPIKey, dbQuery } from "./apis/neuralmind";
import connectMySQL from "./connect/mysql";
import mysql from "./interfaces/mysql";

export default class NeuralmindDB {
  db: string = "";
  apiKey: string = "";
  connection: mysql;
  dbFunc: any;
  constructor(db: string, apiKey: string, connection: mysql) {
    this.db = db;
    this.apiKey = apiKey;
    this.connection = connection;
  }

  // Check connection
  async connect() {
    if (this.db === "mysql") {
      const connectResponse: any = await connectMySQL(this.connection);
      if (!connectResponse) {
        console.error("Connecting with MySQL server failed.");
        return;
      }
      this.dbFunc = connectResponse;
      return true;
    }
  }

  // Get tables;
  async tables() {
    const [result, metaData] = await this.dbFunc.query(`SHOW TABLES`);
    const tables = result.map((value: any) => value[Object.keys(value)[0]]);
    return tables;
  }

  async generateDBSchema(tables = []) {
    if (tables.length === 0) tables = await this.tables();
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
  }

  async run(query: string) {
    try {
      if (this.db === "mysql") {
        const [result, metaData] = await this.dbFunc.query(query);

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
      const response: any = await dbQuery({ query, api_key: this.apiKey });
      if (!response.response) return false;
      return response.response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
