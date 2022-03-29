"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.seed = void 0;
const User_1 = __importStar(require("../entities/User"));
const supertest_1 = __importDefault(require("supertest"));
const test_helper_1 = require("./test-helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userOneID = 1;
const userTwoID = 2;
exports.seed = {
    User: {
        authUser: {
            user_1: {
                id: userOneID,
                first_name: "Shayaan",
                last_name: "Sohail",
                email: "shayaan199@gmail.com",
                password: "12345678",
                role: User_1.UserRole.USER,
                tokens: [{
                        access: 'auth',
                        token: jsonwebtoken_1.default.sign({ _id: userOneID, access: 'auth' }, process.env.JWT_SECRET).toString()
                    }]
            },
            user_2: {
                id: userTwoID,
                first_name: "Ali",
                last_name: "Rashid",
                email: "ali12@gmail.com",
                password: "12345678",
                role: User_1.UserRole.USER,
                tokens: [{
                        access: 'auth',
                        token: jsonwebtoken_1.default.sign({ _id: userTwoID, access: 'auth' }, process.env.JWT_SECRET).toString()
                    }]
            },
        },
        user_3: {
            first_name: "Obaid",
            last_name: "Aqeel",
            email: "obaid3035@gmail.com",
            password: "12345678",
            role: User_1.UserRole.USER,
        },
    },
    post: {
        text: "Lorem Ipsum Dolor Asup"
    }
};
const loginUser = (auth, userInput) => {
    return (done) => {
        const user = User_1.default.create({
            email: userInput.email,
            password: userInput.password,
            first_name: userInput.first_name,
            last_name: userInput.last_name,
            role: userInput.role,
        });
        user.save().then((user) => {
            (0, supertest_1.default)(test_helper_1.app)
                .post('/auth/login')
                .send(userInput)
                .end((err, res) => {
                if (err) {
                    done(err);
                }
                if (res.body.auth) {
                    auth.token = res.body.token;
                    auth.user = user;
                    return done();
                }
            });
        });
    };
};
exports.loginUser = loginUser;
