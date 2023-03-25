"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const neuralmind_1 = require("./apis/neuralmind");
const mysql_1 = __importDefault(require("./connect/mysql"));
const postgre_1 = __importDefault(require("./connect/postgre"));
const mongo_1 = __importDefault(require("./connect/mongo"));
class NeuralmindDB {
    constructor(db, apiKey, connection) {
        this.db = "";
        this.apiKey = "";
        this.db = db;
        this.apiKey = apiKey;
        this.connection = connection;
    }
    // dialect dynamic
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db === "mysql") {
                const connectResponse = yield (0, mysql_1.default)(this.connection);
                if (!connectResponse) {
                    console.error("Connecting with MySQL server failed.");
                    return;
                }
                this.dbFunc = connectResponse;
                return true;
            }
            else if (this.db === "postgres") {
                const connectResponse = yield (0, postgre_1.default)(this.connection);
                if (!connectResponse) {
                    console.error("Connecting with PostgreSQL server failed.");
                    return;
                }
                this.dbFunc = connectResponse;
                return true;
            }
            else if (this.db === "mongodb") {
                const connectResponse = yield (0, mongo_1.default)(`mongodb+srv://${this.connection.username}:${this.connection.password}@${this.connection.host}/?retryWrites=true&w=majority`, "development");
                if (!connectResponse) {
                    console.error("Connecting with MongoDB server failed.");
                    return;
                }
                this.dbFunc = connectResponse;
                return true;
            }
            else {
                console.error("Invalid database type.");
                return false;
            }
        });
    }
    // Get tables;
    tables() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db === "mysql") {
                const [result, metaData] = yield this.dbFunc.query(`SHOW TABLES`);
                const tables = result.map((value) => value[Object.keys(value)[0]]);
                return tables;
            }
            else if (this.db === "postgres") {
                const result = yield this.dbFunc.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';");
                const tables = result[0].map((value) => value.tablename);
                return tables;
            }
            else if (this.db === "mongodb") {
                const collections = yield this.dbFunc.listCollections().toArray();
                const tables = collections.map((collection) => collection.name);
                return tables;
            }
            else {
                console.error("Invalid database type.");
                return [];
            }
        });
    }
    generateDBSchema(tables = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tables.length === 0)
                tables = yield this.tables();
            if (this.db === "mysql") {
                let schemas = "";
                for (let index = 0; index < tables.length; index++) {
                    const table = tables[index];
                    const [result, metaData] = yield this.dbFunc.query(`SHOW CREATE TABLE ${table}`);
                    if (result.length === 0)
                        return;
                    schemas += `\n Schema: ${result[0]["Create Table"]}`;
                }
                return schemas;
            }
            else if (this.db === "postgres") {
                let schemas = "";
                for (let index = 0; index < tables.length; index++) {
                    const table = tables[index];
                    const [result] = yield this.dbFunc.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name='${table}'`);
                    schemas += `\n\nTable: ${table}\n`;
                    for (const row of result) {
                        schemas += `Column: ${row.column_name}, Type: ${row.data_type}\n`;
                    }
                }
                return schemas;
            }
            else if (this.db === "mongodb") {
                let schemas = "";
                for (let index = 0; index < tables.length; index++) {
                    const table = tables[index];
                    const connection = this.dbFunc.collection(table);
                    const result = yield connection.find().toArray();
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
            }
            else {
                console.error("Invalid database type.");
                return "";
            }
        });
    }
    run(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.db === "mysql" || this.db == "postgres") {
                    const [result, metaData] = yield this.dbFunc.query(query);
                    return result;
                }
                else if (this.db === "postgresql") {
                    const result = yield this.dbFunc.query(query);
                    return result.rows;
                }
                else if (this.db === "mongodb") {
                    const collection = query.split("db.")[1].split(".find")[0];
                    const result = yield eval(`this.dbFunc.collection('${collection}').find${query.split("db.")[1].split(".find")[1]}`).toArray();
                    return result;
                }
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    /**
     *
     * @param tables default empty array, and it will get all the table schema from the database
     * @param rules default empty array, and it will make sure every request satisfy some needs
     * @returns Boolean tells if the opperation is succcessfull or not
     */
    sync(tables = [], rules = []) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schemas = tables.length > 0
                    ? yield this.generateDBSchema(tables)
                    : yield this.generateDBSchema();
                const response = yield (0, neuralmind_1.getDBByAPIKey)(this.apiKey, {
                    schemas,
                    rules,
                });
                //response.result contain the updated object
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    /**
     *
     * @param query End user query
     * @returns { string / false}
     */
    query(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, neuralmind_1.dbQuery)({
                    query,
                    api_key: this.apiKey,
                    db_type: "NoSQL",
                });
                if (!response.response)
                    return false;
                return response.response;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
exports.default = NeuralmindDB;
//# sourceMappingURL=index.js.map