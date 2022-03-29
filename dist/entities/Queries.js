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
var Queries_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("./User"));
const Topic_1 = __importDefault(require("./Topic"));
const Answer_1 = __importDefault(require("./Answer"));
let Queries = Queries_1 = class Queries extends typeorm_1.BaseEntity {
};
Queries.MODEL_NAME = "queries";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Queries.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar')
], Queries.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.queries),
    (0, typeorm_1.JoinColumn)({
        name: "user_id",
    })
], Queries.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Queries.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Topic_1.default, (topic) => topic.queries),
    (0, typeorm_1.JoinColumn)({
        name: "topic_id",
    })
], Queries.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Queries.prototype, "topic_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Answer_1.default, (answer) => answer.queries)
], Queries.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Queries.prototype, "created_at", void 0);
Queries = Queries_1 = __decorate([
    (0, typeorm_1.Entity)(Queries_1.MODEL_NAME)
], Queries);
exports.default = Queries;
