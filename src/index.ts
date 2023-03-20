import connectMySQL from "./connect/mysql";
import mysql from "./interfaces/mysql";
import connectPostgre from "./connect/postgre";
import postgre from "./interfaces/postgre";

export default class NeuralmindDB {
  db: string = "";
  apiKey: string = "";
  connection: mysql | postgre;
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
      const connectResponse: any = await connectPostgre(this.connection as postgre);
      if (!connectResponse) {
        console.error("Connecting with PostgreSQL server failed.");
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
      const result = await this.dbFunc.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';");
      const tables = result[0].map((value: any) => value.tablename);
      return tables;
    } else {
      console.error("Invalid database type.");
      return [];
    }
  }

  async generateDBSchema() {
    if (this.db === "mysql") {
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
    } else if (this.db === "postgres") {
      const tables = await this.tables();
      let schemas: string = "";
      for (let index = 0; index < tables.length; index++) {
        const table = tables[index];
        const result = await this.dbFunc.query(
          `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name='${table}'`
        );
        schemas += `\n\nTable: ${table}\n`;
        for (const row of result) {
          schemas += `Column: ${row.column_name}, Type: ${row.data_type}\n`;
        }
      }
      return schemas;
    } else {
      console.error("Invalid database type.");
      return "";
    }
  }
}



(async () => {
  const test = new NeuralmindDB("postgres", "test", {
    database: "mydatabase",
    username: "myuser",
    password: "mypassword",
    host: "127.0.0.1",
    port: 5432,
  });

  await test.connect();
  const tables = await test.generateDBSchema();
  console.log(tables);
})();
function tables() {
  throw new Error("Function not implemented.");
}

function generateDBSchema() {
  throw new Error("Function not implemented.");
}

