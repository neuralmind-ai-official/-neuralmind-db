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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectMySQL = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sequelize = new sequelize_1.Sequelize(//instance of sequelize
        payload.database, payload.username, payload.password, {
            host: payload.host,
            port: payload.port,
            dialect: "mysql",
            logging: false,
        });
        yield sequelize.authenticate();
        return sequelize;
    }
    catch (error) {
        return false;
    }
});
exports.default = connectMySQL;
//# sourceMappingURL=mysql.js.map