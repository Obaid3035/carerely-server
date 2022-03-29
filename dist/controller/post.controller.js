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
const PostService_1 = __importDefault(require("../services/PostService"));
const http_status_codes_1 = require("http-status-codes");
const multer_1 = __importDefault(require("../middleware/multer"));
const User_1 = require("../entities/User");
class PostController {
    constructor() {
        this.path = "/posts";
        this.router = (0, express_1.Router)();
        this.index = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNo = parseInt(req.query.page);
                const size = parseInt(req.query.size);
                const postInstance = typedi_1.Container.get(PostService_1.default);
                const posts = yield postInstance.index(req.user, size * pageNo, size);
                res.status(http_status_codes_1.StatusCodes.OK).json(posts);
            }
            catch (e) {
                next(e);
            }
        });
        this.getTrendingPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNo = parseInt(req.query.page);
                const size = parseInt(req.query.size);
                const postInstance = typedi_1.Container.get(PostService_1.default);
                const posts = yield postInstance.getTrendingPost(size * pageNo, size);
                res.status(http_status_codes_1.StatusCodes.OK).json(posts);
            }
            catch (e) {
                next(e);
            }
        });
        this.currentUserPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNo = parseInt(req.query.page);
                const size = parseInt(req.query.size);
                const postInstance = typedi_1.Container.get(PostService_1.default);
                const posts = yield postInstance.currentUserPost(req.user, size * pageNo, size);
                res.status(http_status_codes_1.StatusCodes.OK).json(posts);
            }
            catch (e) {
                console.log(e);
                next(e);
            }
        });
        this.show = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                const user = req.user;
                const postInstance = typedi_1.Container.get(PostService_1.default);
                const posts = yield postInstance.show(postId, user);
                res.status(http_status_codes_1.StatusCodes.OK).json(posts);
            }
            catch (e) {
                next(e);
            }
        });
        this.getFewTrendingPost = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const postInstance = typedi_1.Container.get(PostService_1.default);
                const posts = yield postInstance.getFewTrendingPost();
                res.status(http_status_codes_1.StatusCodes.OK).json(posts);
            }
            catch (e) {
                next(e);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postInstance = typedi_1.Container.get(PostService_1.default);
                const post = yield postInstance.create(req.body, user, req.file);
                res.status(http_status_codes_1.StatusCodes.CREATED).json(post);
            }
            catch (e) {
                console.log(e);
                next(e);
            }
        });
        this.otherPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                console.log(user.email);
                const otherUserId = req.params.id;
                const pageNo = parseInt(req.query.page);
                const size = parseInt(req.query.size);
                const postInstance = typedi_1.Container.get(PostService_1.default);
                const posts = yield postInstance.otherPost(user, otherUserId, size * pageNo, size);
                res.status(http_status_codes_1.StatusCodes.OK).json(posts);
            }
            catch (e) {
                next(e);
            }
        });
        this.router
            .get(`${this.path}`, (0, auth_1.default)(User_1.UserRole.USER), this.index)
            .post(`${this.path}`, (0, auth_1.default)(User_1.UserRole.USER), multer_1.default.single("image"), this.create)
            .get(`${this.path}/trending/few`, (0, auth_1.default)(User_1.UserRole.USER), this.getFewTrendingPost)
            .get(`${this.path}/trending`, (0, auth_1.default)(User_1.UserRole.USER), this.getTrendingPost)
            .get(`${this.path}/user/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.otherPost)
            .get(`${this.path}/current-user`, (0, auth_1.default)(User_1.UserRole.USER), this.currentUserPost)
            .get(`${this.path}/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.show);
    }
}
exports.default = PostController;
