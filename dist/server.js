"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const user_controller_1 = __importDefault(require("./controller/user.controller"));
const user_controller_2 = __importDefault(require("./controller/admin/user.controller"));
const friendShip_controller_1 = __importDefault(require("./controller/friendShip.controller"));
const post_controller_1 = __importDefault(require("./controller/post.controller"));
const like_controller_1 = __importDefault(require("./controller/like.controller"));
const comment_controller_1 = __importDefault(require("./controller/comment.controller"));
const queries_controller_1 = __importDefault(require("./controller/queries.controller"));
const blog_controller_1 = __importDefault(require("./controller/admin/blog.controller"));
const blog_controller_2 = __importDefault(require("./controller/blog.controller"));
new app_1.default([
    new user_controller_1.default(),
    new user_controller_2.default(),
    new friendShip_controller_1.default(),
    new post_controller_1.default(),
    new like_controller_1.default(),
    new comment_controller_1.default(),
    new queries_controller_1.default(),
    new blog_controller_1.default(),
    new blog_controller_2.default()
]).bootstrap();
