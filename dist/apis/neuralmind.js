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
exports.dbQuery = exports.getDBByAPIKey = void 0;
const axios_1 = __importDefault(require("axios"));
const baseURL = process.env.NEURALMIND_REST
    ? process.env.NEURALMIND_REST
    : `https://api.neuralmind.io/`;
const getDBByAPIKey = (api_key, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.put(baseURL + `api/v1/db-schema-api-key`, Object.assign({ api_key }, payload));
            resolve(response.data);
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.getDBByAPIKey = getDBByAPIKey;
const dbQuery = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(baseURL + `v1/api-db-query`, payload);
            resolve(response.data);
        }
        catch (error) {
            reject(error);
        }
    }));
});
exports.dbQuery = dbQuery;
//# sourceMappingURL=neuralmind.js.map