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
var Topic_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Queries_1 = __importDefault(require("./Queries"));
let Topic = Topic_1 = class Topic extends typeorm_1.BaseEntity {
};
Topic.MODEL_NAME = "topic";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Topic.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar')
], Topic.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Queries_1.default, (queries) => queries.topic)
], Topic.prototype, "queries", void 0);
Topic = Topic_1 = __decorate([
    (0, typeorm_1.Entity)(Topic_1.MODEL_NAME)
], Topic);
exports.default = Topic;
