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
    const test = new index_1.default("postgres", "5942137df5c9672ef3577cf4ef8fc224", {
        database: "postgres",
        username: "abraham",
        password: "new_password",
        host: "127.0.0.1",
        port: 5432,
    });
    yield test.connect(); // check the connection
    // We can do hard filter
    const rules = [
        {
            name: "user_id",
            required: true,
            rule: "Every query need to include user_id and user_id value will be ${user_id}",
        },
    ];
    yield test.sync([], rules);
    let query = yield test.query("What is my bio?"); // A query (In this case SQL) that you can run anywhere you want or even in our library
    // let's replace ${user_id} with actual userId,
    const userId = 2; // this can be set by you
    query = query.replace(`\${user_id}`, `${userId}`);
    console.log(query);
    console.log(yield test.run(query));
}))();
//# sourceMappingURL=test.js.map