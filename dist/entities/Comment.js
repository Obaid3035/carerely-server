"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Comment_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Post_1 = __importDefault(require("./Post"));
const User_1 = __importDefault(require("./User"));
let Comment = Comment_1 = class Comment extends typeorm_1.BaseEntity {
};
Comment.Model_NAME = 'comment';
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Post_1.default, (post) => post.comment),
    (0, typeorm_1.JoinColumn)({
        name: 'post_id',
    })
], Comment.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Comment.prototype, "post_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.comment),
    (0, typeorm_1.JoinColumn)({
        name: 'user_id',
    })
], Comment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Comment.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar')
], Comment.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Comment.prototype, "created_at", void 0);
Comment = Comment_1 = __decorate([
    (0, typeorm_1.Entity)(Comment_1.Model_NAME)
], Comment);
exports.default = Comment;
