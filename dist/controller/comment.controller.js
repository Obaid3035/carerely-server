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
const CommentService_1 = __importDefault(require("../services/CommentService"));
const http_status_codes_1 = require("http-status-codes");
const typedi_1 = require("typedi");
const User_1 = require("../entities/User");
class CommentController {
    constructor() {
        this.path = "/comments";
        this.router = (0, express_1.Router)();
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                const user = req.user;
                const commentServiceInstance = typedi_1.Container.get(CommentService_1.default);
                const comment = yield commentServiceInstance.create(user, parseInt(postId), req.body);
                res.status(http_status_codes_1.StatusCodes.CREATED).json(comment);
            }
            catch (e) {
                next(e);
            }
        });
        this.router
            .post(`${this.path}/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.create);
    }
}
exports.default = CommentController;
