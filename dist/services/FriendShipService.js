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
const FriendShip_1 = __importStar(require("../entities/FriendShip"));
const User_1 = __importDefault(require("../entities/User"));
const errorCode_1 = __importStar(require("../utils/errorCode"));
const typeorm_1 = require("typeorm");
let FriendShipService = class FriendShipService {
    getUserFollower(currUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FriendShip_1.default.createQueryBuilder("friendShip")
                .select(["friendShip", "user.user_name"])
                .where("friendShip.receiver_id = :receiver_id", { receiver_id: currUserId })
                .innerJoin("friendShip.sender", "user")
                .getMany();
        });
    }
    getUserFollowing(currUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FriendShip_1.default.createQueryBuilder("friendShip")
                .select(["friendShip", "user.user_name"])
                .where("friendShip.sender_id = :sender_id", { sender_id: currUserId })
                .innerJoin("friendShip.receiver", "user")
                .getMany();
        });
    }
    unFollowFriendship(friendShipId) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendShip = yield FriendShip_1.default.findOne({
                where: {
                    id: friendShipId
                }
            });
            if (!friendShip) {
                throw new errorCode_1.NotFound("FriendShip not found");
            }
            yield FriendShip_1.default.remove(friendShip);
            return {
                deleted: true
            };
        });
    }
    sendFriendShipRequest(sender, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("*********** Creating FriendShip *************");
            const receiver = yield User_1.default.findOne({
                where: {
                    id: receiverId
                }
            });
            if (!receiver) {
                throw new errorCode_1.NotFound("User not found");
            }
            const friendShip = FriendShip_1.default.create({
                sender: sender,
                receiver: receiver,
            });
            yield friendShip.save();
            console.log("*********** FriendShip Created Successfully *************");
            return {
                saved: true,
                status: "VIEW",
            };
        });
    }
    acceptFriendShipRequest(receiver, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield User_1.default.findOne({
                where: {
                    id: senderId
                }
            });
            if (!sender) {
                throw new errorCode_1.NotFound("User not found");
            }
            const friendShip = yield FriendShip_1.default.findOne({
                where: {
                    sender_id: sender.id,
                    receiver_id: receiver.id,
                },
            });
            if (friendShip.status === FriendShip_1.FriendShipStatus.COMPLETE) {
                throw new errorCode_1.default("Sorry friendship is already complete");
            }
            friendShip.status = FriendShip_1.FriendShipStatus.COMPLETE;
            yield friendShip.save();
            return {
                updated: true,
                status: "VIEW",
            };
        });
    }
    declineFriendShipRequest(receiver, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield User_1.default.findOne({
                where: {
                    id: senderId
                }
            });
            if (!sender) {
                throw new errorCode_1.NotFound("User not found");
            }
            const friendShip = yield FriendShip_1.default.findOne({
                where: {
                    sender_id: sender.id,
                    receiver_id: receiver.id,
                },
            });
            if (!friendShip) {
                throw new errorCode_1.default("Sorry FriendShip Request does not exist");
            }
            yield FriendShip_1.default.delete(friendShip.id);
            return {
                deleted: true,
                status: "SEND",
            };
        });
    }
    deleteFriendShip(userId_1, user_2) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("************** Checking if user 1 is the sender and user 2 is receiver *************");
            const friendShip_1 = yield FriendShip_1.default.createQueryBuilder("friendship")
                .where(new typeorm_1.Brackets((qb) => {
                qb.where("friendship.receiver_id = :receiver_id", {
                    receiver_id: userId_1,
                }).andWhere("friendship.sender_id = :sender_id", {
                    sender_id: user_2.id,
                });
            }))
                .getOne();
            const friendShip_2 = yield FriendShip_1.default.createQueryBuilder("friendship")
                .where(new typeorm_1.Brackets((qb) => {
                qb.where("friendship.receiver_id = :receiver_id", {
                    receiver_id: user_2.id,
                }).andWhere("friendship.sender_id = :sender_id", {
                    sender_id: userId_1,
                });
            }))
                .getOne();
            console.log(userId_1, user_2.id);
            if (!friendShip_1 && !friendShip_2) {
                throw new Error("No FriendShip Found");
            }
            if (friendShip_1) {
                yield FriendShip_1.default.delete(friendShip_1.id);
            }
            else {
                yield FriendShip_1.default.delete(friendShip_2.id);
            }
            console.log("************** FriendShip Successfully deleted *************");
            return {
                deleted: true,
                status: "SEND",
            };
        });
    }
};
FriendShipService = __decorate([
    (0, typedi_1.Service)()
], FriendShipService);
exports.default = FriendShipService;
