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
const auth_1 = __importDefault(require("../middleware/auth"));
const typedi_1 = require("typedi");
const LikeService_1 = __importDefault(require("../services/LikeService"));
const User_1 = require("../entities/User");
class LikeController {
    constructor() {
        this.path = "/likes";
        this.router = (0, express_1.Router)();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postId = req.params.id;
                const likeServiceInstance = typedi_1.Container.get(LikeService_1.default);
                const { liked } = yield likeServiceInstance.create(user, parseInt(postId));
                res.status(200).json({
                    liked
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.router
            .post(`${this.path}/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.create);
    }
}
exports.default = LikeController;
