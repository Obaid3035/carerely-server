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
const express_1 = require("express");
const typedi_1 = require("typedi");
const UserService_1 = __importDefault(require("../services/UserService"));
const auth_1 = __importDefault(require("../middleware/auth"));
const User_1 = __importStar(require("../entities/User"));
class UserController {
    constructor() {
        this.path = "/auth";
        this.router = (0, express_1.Router)();
        this.searchUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userServiceInstance = typedi_1.Container.get(UserService_1.default);
                const users = req.query.search.length > 0 ?
                    yield userServiceInstance.searchUsers(req.query.search) : [];
                res.status(200).json(users);
            }
            catch (e) {
                next(e);
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userServiceInstance = typedi_1.Container.get(UserService_1.default);
                const { auth, token } = yield userServiceInstance.register(req.body);
                res.status(201).json({ auth, token });
            }
            catch (e) {
                next(e);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userServiceInstance = typedi_1.Container.get(UserService_1.default);
                const { email, password } = req.body;
                const { auth, token, role } = yield userServiceInstance.login(email, password);
                res.status(200).json({
                    auth,
                    token,
                    role
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.authorize = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                yield User_1.default.authorize(token);
                res.status(200).json({ authenticate: true });
            }
            catch (e) {
                console.log(e);
                next(e);
            }
        });
        this.mostFollowedUser = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userServiceInstance = typedi_1.Container.get(UserService_1.default);
                const users = yield userServiceInstance.mostFollowedUser();
                res.status(200).json(users);
            }
            catch (e) {
                next(e);
            }
        });
        this.getUserStats = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const otherUserId = req.params.id;
                const userServiceInstance = typedi_1.Container.get(UserService_1.default);
                const users = yield userServiceInstance.getUserStats(parseInt(otherUserId));
                res.status(200).json(users);
            }
            catch (e) {
                next(e);
            }
        });
        this.getCurrentUserStats = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const userServiceInstance = typedi_1.Container.get(UserService_1.default);
                const users = yield userServiceInstance.getCurrentUserStats(user);
                res.status(200).json(users);
            }
            catch (e) {
                next(e);
            }
        });
        this.router
            .post(`${this.path}/register`, this.register)
            .post(`${this.path}/login`, this.login)
            .get(`${this.path}/authorize/:token`, this.authorize)
            .get(`${this.path}/users`, this.searchUsers)
            .get(`${this.path}/top`, (0, auth_1.default)(User_1.UserRole.USER), this.mostFollowedUser)
            .get(`${this.path}/stats/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.getUserStats)
            .get(`${this.path}/current-user/stats`, (0, auth_1.default)(User_1.UserRole.USER), this.getCurrentUserStats);
    }
}
exports.default = UserController;
