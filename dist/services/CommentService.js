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
const Post_1 = __importDefault(require("../entities/Post"));
const errorCode_1 = require("../utils/errorCode");
const Comment_1 = __importDefault(require("../entities/Comment"));
let CommentService = class CommentService {
    create(currUser, postId, userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findOne({
                where: {
                    id: postId
                }
            });
            if (!post) {
                throw new errorCode_1.NotFound("User not found");
            }
            const createdComment = Comment_1.default.create({
                post: post,
                user_id: currUser.id,
                text: userInput.text,
            });
            yield createdComment.save();
            return yield Comment_1.default.createQueryBuilder("comment")
                .select([
                "comment.id",
                "comment.post_id",
                "comment.text",
                "user.id",
                "user.user_name",
            ])
                .where("comment.id = :id", { id: createdComment.id })
                .innerJoin("comment.user", "user")
                .orderBy("comment.created_at", "ASC")
                .getOne();
        });
    }
};
CommentService = __decorate([
    (0, typedi_1.Service)()
], CommentService);
exports.default = CommentService;
