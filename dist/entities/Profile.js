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
var Profile_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENDER = void 0;
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("./User"));
var GENDER;
(function (GENDER) {
    GENDER["MALE"] = "male";
    GENDER["FEMALE"] = "female";
})(GENDER = exports.GENDER || (exports.GENDER = {}));
let Profile = Profile_1 = class Profile extends typeorm_1.BaseEntity {
};
Profile.MODEL_NAME = "profile";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Profile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("date")
], Profile.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)("float")
], Profile.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar")
], Profile.prototype, "height_unit", void 0);
__decorate([
    (0, typeorm_1.Column)("float")
], Profile.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar")
], Profile.prototype, "weight_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: GENDER,
    })
], Profile.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Profile.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.default),
    (0, typeorm_1.JoinColumn)()
], Profile.prototype, "user", void 0);
Profile = Profile_1 = __decorate([
    (0, typeorm_1.Entity)(Profile_1.MODEL_NAME)
], Profile);
exports.default = Profile;
