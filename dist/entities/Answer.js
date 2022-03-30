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
var Answer_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("./User"));
const Queries_1 = __importDefault(require("./Queries"));
let Answer = Answer_1 = class Answer extends typeorm_1.BaseEntity {
};
Answer.MODEL_NAME = "answer";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Answer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar')
], Answer.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.queries),
    (0, typeorm_1.JoinColumn)({
        name: "user_id",
    })
], Answer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Answer.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Queries_1.default, (queries) => queries.answer),
    (0, typeorm_1.JoinColumn)({
        name: "queries_id",
    })
], Answer.prototype, "queries", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Answer.prototype, "queries_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Answer.prototype, "created_at", void 0);
Answer = Answer_1 = __decorate([
    (0, typeorm_1.Entity)(Answer_1.MODEL_NAME)
], Answer);
exports.default = Answer;
