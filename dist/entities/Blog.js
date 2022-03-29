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
var Blog_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("./User"));
let Blog = Blog_1 = class Blog extends typeorm_1.BaseEntity {
};
Blog.MODEL_NAME = "blog";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Blog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar')
], Blog.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", {
        nullable: true
    })
], Blog.prototype, "feature_image", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar')
], Blog.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean')
], Blog.prototype, "is_featured", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.blog),
    (0, typeorm_1.JoinColumn)({
        name: "user_id",
    })
], Blog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Blog.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Blog.prototype, "created_at", void 0);
Blog = Blog_1 = __decorate([
    (0, typeorm_1.Entity)(Blog_1.MODEL_NAME)
], Blog);
exports.default = Blog;
