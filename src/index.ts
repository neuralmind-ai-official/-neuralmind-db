import connectMySQL from "./connect/mysql";
import mysql from "./interfaces/mysql";

export default class NeuralmindDB {
  db: string = "";
  apiKey: string = "";
  connection: mysql;
  dbFunc: any;
  constructor(db: string, apiKey: string, connection: mysql) {
    this.db = db;
    this.apiKey = db;
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

  async generateDBSchema() {
    const tables = await this.tables();
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
}

(async () => {
  const test = new NeuralmindDB("mysql", "test", {
    database: "store",
    username: "root",
    password: "Current-Root-Password",
    host: "127.0.0.1",
    port: 3306,
  });

  await test.connect();
  const tables = await test.generateDBSchema();
  console.log(tables);
})();
