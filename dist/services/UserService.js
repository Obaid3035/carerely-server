"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const User_1 = __importStar(require("../entities/User"));
const base_service_1 = __importDefault(require("./base.service"));
const FriendShip_1 = __importStar(require("../entities/FriendShip"));
const Post_1 = __importDefault(require("../entities/Post"));
let UserService = class UserService extends base_service_1.default {
    constructor() {
        super(User_1.default);
    }
    searchUsers(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.createQueryBuilder("user")
                .where("user.user_name like :search", { search: `${search}%` })
                .take(5)
                .getMany();
        });
    }
    register(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("********** Registering user ***********");
            const user = User_1.default.create({
                user_name: userInput.user_name,
                email: userInput.email,
                password: userInput.password,
                role: userInput.role ? userInput.role : User_1.UserRole.USER,
            });
            yield user.save();
            const token = user.generateToken();
            console.log("********** User Registered Successfully ***********");
            return {
                token,
                auth: true,
            };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("********** Logging user ***********");
            const user = yield User_1.default.authenticate(email, password);
            const token = user.generateToken();
            console.log("********** User logged in Successfully ***********");
            return {
                auth: true,
                role: user.role,
                token,
            };
        });
    }
    getUserStats(otherUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postCountPromise = Post_1.default.createQueryBuilder("posts")
                .where("posts.user_id = :otherUserId", { otherUserId: otherUserId })
                .getCount();
            const followersCountPromise = FriendShip_1.default.createQueryBuilder("friendship")
                .where("friendship.receiver_id = :receiverId", {
                receiverId: otherUserId,
            })
                .orWhere("friendship.status = :status", { status: FriendShip_1.FriendShipStatus.COMPLETE })
                .getCount();
            const followingsCountPromise = FriendShip_1.default.createQueryBuilder("friendship")
                .where("friendship.sender_id = :senderId", { senderId: otherUserId })
                .orWhere("friendship.status = :status", { status: FriendShip_1.FriendShipStatus.COMPLETE })
                .getCount();
            const otherUserPromise = User_1.default.findOne({
                where: {
                    id: otherUserId,
                },
                select: ["user_name"],
            });
            const [postCount, followersCount, followingCount, otherUser] = yield Promise.all([
                postCountPromise,
                followersCountPromise,
                followingsCountPromise,
                otherUserPromise,
            ]);
            return {
                user: otherUser,
                postCount: postCount,
                followingCount: followingCount,
                followersCount: followersCount,
            };
        });
    }
    getCurrentUserStats(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const postCountPromise = Post_1.default.createQueryBuilder("posts")
                .where("posts.user_id = :otherUserId", { otherUserId: currentUser.id })
                .getCount();
            const followersCountPromise = FriendShip_1.default.createQueryBuilder("friendship")
                .where("friendship.receiver_id = :receiverId", {
                receiverId: currentUser.id,
            })
                .getCount();
            const followingsCountPromise = FriendShip_1.default.createQueryBuilder("friendship")
                .where("friendship.sender_id = :senderId", { senderId: currentUser.id })
                .getCount();
            const [postCount, followersCount, followingCount] = yield Promise.all([
                postCountPromise,
                followersCountPromise,
                followingsCountPromise,
            ]);
            return {
                user: currentUser,
                postCount: postCount,
                followingCount: followingCount,
                followersCount: followersCount,
            };
        });
    }
    mostFollowedUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const mostFollowers = yield FriendShip_1.default.createQueryBuilder("friendship")
                .select("COUNT(friendship.receiver_id)", "count")
                .addSelect("receiver_id")
                .groupBy("friendship.receiver_id")
                .orderBy("count", "DESC")
                .take(4)
                .getRawMany();
            const mostFollowedUserIds = mostFollowers.map((friendship) => friendship.receiver_id);
            return yield User_1.default.createQueryBuilder("user")
                .select(["user.id", "user.user_name"])
                .where("user.id IN(:...receiver_id)", { receiver_id: mostFollowedUserIds })
                .getMany();
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)()
], UserService);
exports.default = UserService;
