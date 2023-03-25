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
const index_1 = __importDefault(require("./index"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const test = new index_1.default("mongodb", "s", {
        database: "s",
        username: "s",
        password: "s",
        host: "sdf",
        port: 27017,
    });
    yield test.connect();
    // We can do hard filter
    const rules = [
        {
            name: "owner",
            required: true,
            rule: "Every query need to include owner key with a pair ${ownerValue}",
        },
    ];
    yield test.sync(["articles", "agents"], rules);
    const query = yield test.query("Can you check an article with a model name test? owner: sdfasdf");
    console.log(query);
    console.log(yield test.run(query));
}))();
//# sourceMappingURL=test.js.map