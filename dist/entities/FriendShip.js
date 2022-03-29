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
var FriendShip_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendShipStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("./User"));
const errorCode_1 = require("../utils/errorCode");
var FriendShipStatus;
(function (FriendShipStatus) {
    FriendShipStatus["PARTIAL"] = "partial";
    FriendShipStatus["COMPLETE"] = "complete";
})(FriendShipStatus = exports.FriendShipStatus || (exports.FriendShipStatus = {}));
let FriendShip = FriendShip_1 = class FriendShip extends typeorm_1.BaseEntity {
    static getValidUserIdsForPost(friendShips, curUserId) {
        let validUserIds = [curUserId];
        friendShips.forEach((friendShip) => {
            switch (friendShip.status) {
                case FriendShipStatus.PARTIAL:
                    if (friendShip.receiver_id !== curUserId) {
                        validUserIds.push(friendShip.receiver_id);
                    }
                    break;
                case FriendShipStatus.COMPLETE:
                    validUserIds.push(friendShip.sender_id);
            }
        });
        return validUserIds;
    }
    checkIfFriendShipAlreadyExists() {
        return __awaiter(this, void 0, void 0, function* () {
            const friendship = this;
            const found_1 = yield FriendShip_1.findOne({
                sender: friendship.sender,
                receiver: friendship.receiver
            });
            if (found_1) {
                throw new errorCode_1.BadRequest("Sorry friendship is already exist");
            }
            const found_2 = yield FriendShip_1.findOne({
                sender: friendship.receiver,
                receiver: friendship.sender
            });
            if (found_2) {
                throw new errorCode_1.BadRequest("Sorry friendship is already exist");
            }
        });
    }
};
FriendShip.MODEL_NAME = "friendship";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], FriendShip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("enum", {
        enum: FriendShipStatus,
        default: FriendShipStatus.PARTIAL
    })
], FriendShip.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.sender, {
        nullable: false
    }),
    (0, typeorm_1.JoinColumn)({
        name: "sender_id"
    })
], FriendShip.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], FriendShip.prototype, "sender_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.receiver, {
        nullable: false
    }),
    (0, typeorm_1.JoinColumn)({
        name: "receiver_id",
    })
], FriendShip.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], FriendShip.prototype, "receiver_id", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)()
], FriendShip.prototype, "checkIfFriendShipAlreadyExists", null);
FriendShip = FriendShip_1 = __decorate([
    (0, typeorm_1.Entity)(FriendShip_1.MODEL_NAME)
], FriendShip);
exports.default = FriendShip;
