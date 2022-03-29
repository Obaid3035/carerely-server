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
exports.app = void 0;
const mocha_1 = require("mocha");
const typeorm_1 = require("typeorm");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const app_1 = __importDefault(require("../app"));
const user_controller_2 = __importDefault(require("../controller/admin/user.controller"));
const friendShip_controller_1 = __importDefault(require("../controller/friendShip.controller"));
const post_controller_1 = __importDefault(require("../controller/post.controller"));
let application;
let connection;
let server;
(0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
    connection = yield (0, typeorm_1.createConnection)(process.env.DB_NAME);
    if (connection.isConnected) {
        application = yield new app_1.default([
            new user_controller_1.default(),
            new user_controller_2.default(),
            new friendShip_controller_1.default(),
            new post_controller_1.default(),
        ]);
        exports.app = application.app;
        server = yield exports.app.listen(process.env.PORT);
    }
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const entities = (0, typeorm_1.getConnection)().entityMetadatas;
    for (const entity of entities) {
        const repository = (0, typeorm_1.getConnection)().getRepository(entity.name);
        yield repository.delete({});
    }
}));
(0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.close();
    yield connection.close();
}));
