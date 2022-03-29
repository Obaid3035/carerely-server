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
var Like_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Post_1 = __importDefault(require("./Post"));
const User_1 = __importDefault(require("./User"));
let Like = Like_1 = class Like extends typeorm_1.BaseEntity {
};
Like.MODEL_NAME = "like";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Like.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Post_1.default, (post) => post.like),
    (0, typeorm_1.JoinColumn)({
        name: "post_id",
    })
], Like.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Like.prototype, "post_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.like),
    (0, typeorm_1.JoinColumn)({
        name: "user_id",
    })
], Like.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Like.prototype, "user_id", void 0);
Like = Like_1 = __decorate([
    (0, typeorm_1.Entity)(Like_1.MODEL_NAME)
], Like);
exports.default = Like;
