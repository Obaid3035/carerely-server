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
const User_1 = require("../entities/User");
const BlogService_1 = __importDefault(require("../services/BlogService"));
const typedi_1 = require("typedi");
class BlogController {
    constructor() {
        this.path = "/blogs";
        this.router = (0, express_1.Router)();
        this.index = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogServiceInstance = typedi_1.Container.get(BlogService_1.default);
                const blog = yield blogServiceInstance.index();
                res.status(200).json(blog);
            }
            catch (e) {
                next(e);
            }
        });
        this.show = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const blogId = req.params.id;
                const blogServiceInstance = typedi_1.Container.get(BlogService_1.default);
                const blog = yield blogServiceInstance.show(blogId);
                res.status(200).json(blog);
            }
            catch (e) {
                next(e);
            }
        });
        this.router
            .get(`${this.path}`, (0, auth_1.default)(User_1.UserRole.USER), this.index)
            .get(`${this.path}/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.show);
    }
}
exports.default = BlogController;
