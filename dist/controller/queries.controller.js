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
const auth_1 = __importDefault(require("../middleware/auth"));
const QueriesService_1 = __importDefault(require("../services/QueriesService"));
const http_status_codes_1 = require("http-status-codes");
const typedi_1 = require("typedi");
const User_1 = require("../entities/User");
class QueriesController {
    constructor() {
        this.path = "/queries";
        this.router = (0, express_1.Router)();
        this.indexTopic = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queriesServiceInstance = typedi_1.Container.get(QueriesService_1.default);
                const topic = yield queriesServiceInstance.indexTopic();
                res.status(http_status_codes_1.StatusCodes.OK).json(topic);
            }
            catch (e) {
                next(e);
            }
        });
        this.createAnswer = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queriesId = req.params.id;
                const user = req.user;
                const queriesServiceInstance = typedi_1.Container.get(QueriesService_1.default);
                const answer = yield queriesServiceInstance.createAnswer(queriesId, user.id, req.body);
                res.status(http_status_codes_1.StatusCodes.CREATED).json(answer);
            }
            catch (e) {
                next(e);
            }
        });
        this.indexAnswers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queriesId = req.params.id;
                const queriesServiceInstance = typedi_1.Container.get(QueriesService_1.default);
                const topic = yield queriesServiceInstance.indexAnswers(queriesId);
                res.status(http_status_codes_1.StatusCodes.OK).json(topic);
            }
            catch (e) {
                next(e);
            }
        });
        this.createTopic = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queriesServiceInstance = typedi_1.Container.get(QueriesService_1.default);
                const topic = yield queriesServiceInstance.createTopic(req.body);
                res.status(http_status_codes_1.StatusCodes.CREATED).json(topic);
            }
            catch (e) {
                console.log(e);
                next(e);
            }
        });
        this.index = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const topicId = req.params.id;
                const queriesServiceInstance = typedi_1.Container.get(QueriesService_1.default);
                const topic = yield queriesServiceInstance.index(topicId);
                res.status(http_status_codes_1.StatusCodes.OK).json(topic);
            }
            catch (e) {
                next(e);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const topicId = req.params.id;
                const user = req.user;
                const queriesServiceInstance = typedi_1.Container.get(QueriesService_1.default);
                const topic = yield queriesServiceInstance.create(topicId, user.id, req.body);
                res.status(http_status_codes_1.StatusCodes.CREATED).json(topic);
            }
            catch (e) {
                next(e);
            }
        });
        this.router
            .get(`${this.path}/topic`, (0, auth_1.default)(User_1.UserRole.USER), this.indexTopic)
            .post(`${this.path}/topic`, (0, auth_1.default)(User_1.UserRole.USER), this.createTopic)
            .get(`${this.path}/answer/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.indexAnswers)
            .post(`${this.path}/answer/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.createAnswer)
            .get(`${this.path}/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.index)
            .post(`${this.path}/:id`, (0, auth_1.default)(User_1.UserRole.USER), this.create);
    }
}
exports.default = QueriesController;
