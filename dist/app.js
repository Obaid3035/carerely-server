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
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = __importDefault(require("./config/database"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
class App {
    constructor(controllers) {
        this.app = (0, express_1.default)();
        this.initializeMiddleware();
        this.initializeController(controllers);
        this.initializeErrorHandler();
    }
    bootstrap() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                database_1.default.initialize()
                    .then(() => {
                    console.log("Data Source has been initialized!");
                    this.app.listen(4000, () => {
                        console.log('Server is up and running');
                    });
                })
                    .catch((err) => {
                    console.error("Error during Data Source initialization", err);
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    initializeMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    initializeController(controllers) {
        controllers.forEach((controller) => {
            this.app.use(controller.router);
        });
    }
    initializeErrorHandler() {
        this.app.use(errorHandler_1.default);
    }
}
exports.default = App;
