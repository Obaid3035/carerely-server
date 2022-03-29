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
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const base_service_1 = __importDefault(require("./base.service"));
const Queries_1 = __importDefault(require("../entities/Queries"));
const Topic_1 = __importDefault(require("../entities/Topic"));
const errorCode_1 = __importDefault(require("../utils/errorCode"));
const Answer_1 = __importDefault(require("../entities/Answer"));
let QueriesService = class QueriesService extends base_service_1.default {
    constructor() {
        super(Queries_1.default);
    }
    indexTopic() {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = yield Topic_1.default.createQueryBuilder("topic")
                .getMany();
            return topic;
        });
    }
    createAnswer(queriesId, userId, userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const queries = yield Queries_1.default.findOne(queriesId);
            if (!queries) {
                throw new errorCode_1.default("Topic not found");
            }
            const answer = Answer_1.default.create({
                queries: queries,
                text: userInput.text,
                user_id: userId
            });
            yield answer.save();
            return yield Answer_1.default.createQueryBuilder("answers")
                .select([
                "answers.id",
                "answers.text",
                "user.id",
                "user.user_name",
            ])
                .where("answers.id = :id", { id: answer.id })
                .innerJoin("answers.user", "user")
                .orderBy("answers.created_at", "ASC")
                .getOne();
        });
    }
    index(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queries = yield Queries_1.default.createQueryBuilder("queries")
                .select([
                "queries.id",
                "queries.text",
                "user.id",
                "user.user_name",
            ])
                .where("queries.topic_id = :id", { id: topicId })
                .loadRelationCountAndMap("queries.answerCount", "queries.answer")
                .innerJoin("queries.user", "user")
                .orderBy("queries.created_at", "ASC")
                .getMany();
            return queries;
        });
    }
    create(topicId, userId, userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = yield Topic_1.default.findOne(topicId);
            if (!topic) {
                throw new errorCode_1.default("Topic not found");
            }
            const queries = Queries_1.default.create({
                topic: topic,
                text: userInput.text,
                user_id: userId
            });
            yield queries.save();
            return yield Queries_1.default.createQueryBuilder("queries")
                .select([
                "queries.id",
                "queries.text",
                "user.id",
                "user.user_name",
            ])
                .where("queries.id = :id", { id: queries.id })
                .loadRelationCountAndMap("queries.answerCount", "queries.answer")
                .innerJoin("queries.user", "user")
                .getOne();
        });
    }
    createTopic(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = Topic_1.default.create({
                text: userInput.text
            });
            yield topic.save();
            return {
                saved: true
            };
        });
    }
    indexAnswers(queriesId) {
        return __awaiter(this, void 0, void 0, function* () {
            const answers = yield Answer_1.default.createQueryBuilder("answers")
                .select([
                "answers.id",
                "answers.text",
                "user.id",
                "user.user_name",
            ])
                .where("answers.queries_id = :id", { id: queriesId })
                .innerJoin("answers.user", "user")
                .orderBy("answers.created_at", "ASC")
                .getMany();
            return answers;
        });
    }
};
QueriesService = __decorate([
    (0, typedi_1.Service)()
], QueriesService);
exports.default = QueriesService;
