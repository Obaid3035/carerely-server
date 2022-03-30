"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const FriendShip_1 = __importDefault(require("./FriendShip"));
const Post_1 = __importDefault(require("./Post"));
const Like_1 = __importDefault(require("./Like"));
const Comment_1 = __importDefault(require("./Comment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorCode_1 = require("../utils/errorCode");
const Profile_1 = __importDefault(require("./Profile"));
const Queries_1 = __importDefault(require("./Queries"));
const Blog_1 = __importDefault(require("./Blog"));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
let User = User_1 = class User extends typeorm_1.BaseEntity {
    static authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.findOne({
                where: {
                    email,
                }
            });
            if (!user) {
                throw new errorCode_1.NotFound("Unable too login. Please registered yourself");
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new errorCode_1.BadRequest("Email or Password is incorrect");
            }
            return user;
        });
    }
    static authorize(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield User_1.findOne(decode.user._id);
            if (!user) {
                throw new errorCode_1.UnAuthorized("Session expired");
            }
        });
    }
    generateToken() {
        const user = this;
        console.log(user);
        delete user.password;
        return jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET);
    }
    userAlreadyExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.findOne({
                where: {
                    email: this.email
                }
            });
            if (user) {
                throw new errorCode_1.NotFound("Sorry this email is already in use");
            }
        });
    }
    encryptPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this;
            if (user.password) {
                this.password = yield bcrypt_1.default.hash(user.password, 10);
            }
        });
    }
};
User.MODEL_NAME = "user";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("varchar", {
        length: 25,
    })
], User.prototype, "user_name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        length: 50,
        unique: true,
    })
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar")
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: UserRole,
    })
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        default: false,
    })
], User.prototype, "profile_setup", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FriendShip_1.default, (friendShip) => friendShip.sender)
], User.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FriendShip_1.default, (friendShip) => friendShip.receiver)
], User.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Post_1.default, (post) => post.user)
], User.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Like_1.default, (like) => like.user)
], User.prototype, "like", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Comment_1.default, (comment) => comment.user)
], User.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Profile_1.default, (profile) => profile.user)
], User.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Queries_1.default, (queries) => queries.user)
], User.prototype, "queries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Blog_1.default, (blog) => blog.user)
], User.prototype, "blog", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)()
], User.prototype, "userAlreadyExists", null);
__decorate([
    (0, typeorm_1.BeforeInsert)()
], User.prototype, "encryptPassword", null);
User = User_1 = __decorate([
    (0, typeorm_1.Entity)(User_1.MODEL_NAME)
], User);
exports.default = User;
