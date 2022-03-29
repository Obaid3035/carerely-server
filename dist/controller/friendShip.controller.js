"use strict";
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
const express_1 = require("express");
const User_1 = require("../entities/User");
const FriendShipService_1 = __importDefault(require("../services/FriendShipService"));
const typedi_1 = require("typedi");
const auth_1 = __importDefault(require("../middleware/auth"));
const http_status_codes_1 = require("http-status-codes");
class FriendShipController {
    constructor() {
        this.path = "/friendship";
        this.router = (0, express_1.Router)();
        this.unFollowFriendship = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const friendShipId = req.params.id;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const { deleted } = yield friendShipInstance.unFollowFriendship(friendShipId);
                res.status(200).json({
                    deleted
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.getOtherUserFollower = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const followingUser = yield friendShipInstance.getUserFollower(userId);
                res.status(200).json(followingUser);
            }
            catch (e) {
                next(e);
            }
        });
        this.getOtherUserFollowing = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const followingUser = yield friendShipInstance.getUserFollowing(userId);
                res.status(200).json(followingUser);
            }
            catch (e) {
                next(e);
            }
        });
        this.getCurrentUserFollower = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currUser = req.user;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const followingUser = yield friendShipInstance.getUserFollower(currUser.id);
                res.status(200).json(followingUser);
            }
            catch (e) {
                next(e);
            }
        });
        this.getCurrentUserFollowing = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currUser = req.user;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const followingUser = yield friendShipInstance.getUserFollowing(currUser.id);
                res.status(200).json(followingUser);
            }
            catch (e) {
                next(e);
            }
        });
        this.sendFriendShipRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { receiverId } = req.params;
                const sender = req.user;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const { saved, status } = yield friendShipInstance.sendFriendShipRequest(sender, receiverId);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    saved,
                    status
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.acceptFriendShipRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId } = req.params;
                const receiver = req.user;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const { updated, status } = yield friendShipInstance.acceptFriendShipRequest(receiver, senderId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    updated,
                    status
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.declineFriendShipRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId } = req.params;
                const receiver = req.user;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const { deleted, status } = yield friendShipInstance.declineFriendShipRequest(receiver, senderId);
                res.status(200).json({
                    deleted,
                    status
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.deleteFriendShip = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user_2 = req.user;
                const friendShipInstance = typedi_1.Container.get(FriendShipService_1.default);
                const { deleted, status } = yield friendShipInstance.deleteFriendShip(userId, user_2);
                res.status(200).json({
                    deleted,
                    status
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.router
            .post(`${this.path}/sent/:receiverId`, (0, auth_1.default)(User_1.UserRole.USER), this.sendFriendShipRequest)
            .put(`${this.path}/accept/:senderId`, (0, auth_1.default)(User_1.UserRole.USER), this.acceptFriendShipRequest)
            .delete(`${this.path}/decline/:senderId`, (0, auth_1.default)(User_1.UserRole.USER), this.declineFriendShipRequest)
            .delete(`${this.path}/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.unFollowFriendship)
            .get(`${this.path}/followings`, (0, auth_1.default)(User_1.UserRole.USER), this.getCurrentUserFollowing)
            .get(`${this.path}/followers`, (0, auth_1.default)(User_1.UserRole.USER), this.getCurrentUserFollower)
            .get(`${this.path}/followings/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.getOtherUserFollowing)
            .get(`${this.path}/followers/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.getOtherUserFollower)
            .delete(`${this.path}/delete-friendship/:userId`, (0, auth_1.default)(User_1.UserRole.USER), this.deleteFriendShip);
    }
}
exports.default = FriendShipController;
