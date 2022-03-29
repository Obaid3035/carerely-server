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
const express_1 = require("express");
const typedi_1 = require("typedi");
const UserService_1 = __importDefault(require("../../services/UserService"));
class AdminUserController {
    constructor() {
        this.path = "/admin";
        this.router = (0, express_1.Router)();
        this.index = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userServiceInstance = typedi_1.Container.get(UserService_1.default);
                const users = yield userServiceInstance.findAll();
                res.status(200).json(users);
            }
            catch (e) {
                next(e);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userServiceInstance = typedi_1.Container.get(UserService_1.default);
                yield userServiceInstance.insert(req.body);
                res.status(201).json({ saved: true });
            }
            catch (e) {
                next(e);
            }
        });
        this.router.get(`${this.path}/users`, this.index);
        this.router.post(`${this.path}/users`, this.create);
    }
}
exports.default = AdminUserController;
