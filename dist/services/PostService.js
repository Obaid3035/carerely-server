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
const base_service_1 = __importDefault(require("./base.service"));
const Post_1 = __importDefault(require("../entities/Post"));
const typedi_1 = require("typedi");
const FriendShip_1 = __importStar(require("../entities/FriendShip"));
const typeorm_1 = require("typeorm");
const Comment_1 = __importDefault(require("../entities/Comment"));
const Like_1 = __importDefault(require("../entities/Like"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
let PostService = class PostService extends base_service_1.default {
    constructor() {
        super(Post_1.default);
    }
    index(user, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("************ Fetching all the friendships of current user ************");
            const friendShips = yield FriendShip_1.default.createQueryBuilder("friendship")
                .where("friendship.sender_id = :sender_id", { sender_id: user.id })
                .orWhere("friendship.receiver_id = :receiver_id", {
                receiver_id: user.id,
            })
                .getMany();
            const validUserIds = FriendShip_1.default.getValidUserIdsForPost(friendShips, user.id);
            console.log("************ Fetching all the post that current user can see ************");
            const postsPromise = yield Post_1.default.createQueryBuilder("post")
                .select(["post", "post_user.id", "post_user.user_name"])
                .where("post.user_id IN(:...user_id)", { user_id: validUserIds })
                .innerJoin("post.user", "post_user")
                .loadRelationCountAndMap("post.like_count", "post.like")
                .loadRelationCountAndMap("post.comment_count", "post.comment")
                .orderBy("post.created_at", "DESC")
                .skip(skip)
                .take(limit)
                .getMany();
            const postCountPromise = yield Post_1.default.createQueryBuilder("post")
                .where("post.user_id IN(:...user_id)", { user_id: validUserIds })
                .innerJoin("post.user", "post_user")
                .getCount();
            const [posts, postCount] = yield Promise.all([postsPromise, postCountPromise]);
            const postIds = posts.map((post) => post.id);
            if (postIds.length <= 0)
                return [];
            const comments = yield Comment_1.default.createQueryBuilder("comment")
                .select(["comment", "user.id", "user.user_name"])
                .where("comment.post_id IN(:...post_id)", { post_id: postIds })
                .innerJoin("comment.user", "user")
                .orderBy("comment.created_at", "DESC")
                .getMany();
            const likedPost = yield Like_1.default.find({
                where: {
                    user_id: user.id,
                },
            });
            return {
                posts: Post_1.default.mergeCommentLikeAndPost(posts, comments, likedPost),
                count: postCount
            };
        });
    }
    getTrendingPost(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const mostLike = yield Like_1.default.createQueryBuilder("likes")
                .select("COUNT(likes.post_id)", "count")
                .addSelect("post_id")
                .groupBy("likes.post_id")
                .orderBy("count", "DESC")
                .take(limit)
                .skip(skip)
                .getRawMany();
            const mostLikedPostIds = mostLike.map((like) => like.post_id);
            return yield Post_1.default.createQueryBuilder("post")
                .select(["post", "user.id", "user.user_name"])
                .where("post.id IN(:...post_id)", { post_id: mostLikedPostIds })
                .loadRelationCountAndMap("post.like_count", "post.like", "count")
                .loadRelationCountAndMap("post.comment_count", "post.comment")
                .leftJoin("post.user", "user")
                .getMany();
        });
    }
    currentUserPost(user, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const postsPromise = Post_1.default.createQueryBuilder("post")
                .select(["post", "post_user.id", "post_user.user_name"])
                .where("post.user_id = :user_id", { user_id: user.id })
                .innerJoin("post.user", "post_user")
                .loadRelationCountAndMap("post.like_count", "post.like")
                .loadRelationCountAndMap("post.comment_count", "post.comment")
                .orderBy("post.created_at", "DESC")
                .skip(skip)
                .take(limit)
                .getMany();
            const postCountPromise = Post_1.default.createQueryBuilder("post")
                .where("post.user_id = :user_id", { user_id: user.id })
                .innerJoin("post.user", "post_user")
                .getCount();
            const [posts, postCount] = yield Promise.all([postsPromise, postCountPromise]);
            const postIds = posts.map((post) => post.id);
            if (postIds.length <= 0)
                return [];
            const comments = yield Comment_1.default.createQueryBuilder("comment")
                .select(["comment", "user.id", "user.user_name"])
                .where("comment.post_id IN(:...post_id)", { post_id: postIds })
                .innerJoin("comment.user", "user")
                .orderBy("comment.created_at", "DESC")
                .getMany();
            const likedPost = yield Like_1.default.find({
                where: {
                    user_id: user.id,
                },
            });
            return {
                posts: Post_1.default.mergeCommentLikeAndPost(posts, comments, likedPost),
                count: postCount,
            };
        });
    }
    show(postId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.createQueryBuilder("post")
                .select(["post", "post_user.id", "post_user.user_name"])
                .where("post.id = :postId", { postId: postId })
                .loadRelationCountAndMap("post.like_count", "post.like", "count")
                .loadRelationCountAndMap("post.comment_count", "post.comment")
                .innerJoin("post.user", "post_user")
                .getOne();
            if (!post) {
                return "No Post Found";
            }
            const comments = yield Comment_1.default.createQueryBuilder("comment")
                .select(["comment", "user.id", "user.user_name"])
                .where("comment.post_id = :post_id", { post_id: post.id })
                .innerJoin("comment.user", "user")
                .orderBy("comment.created_at", "ASC")
                .getMany();
            const likedPost = yield Like_1.default.createQueryBuilder("like")
                .where("like.user_id = :user_id", { user_id: user.id })
                .andWhere("like.post_id = :post_id", { post_id: post.id })
                .getOne();
            post.liked = !!likedPost;
            post.comment = comments;
            return post;
        });
    }
    getFewTrendingPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const mostLike = yield Like_1.default.createQueryBuilder("likes")
                .select("COUNT(likes.post_id)", "count")
                .addSelect("post_id")
                .groupBy("likes.post_id")
                .orderBy("count", "DESC")
                .take(4)
                .getRawMany();
            const mostLikedPostIds = mostLike.map((like) => like.post_id);
            return yield Post_1.default.createQueryBuilder("post")
                .select(["post", "user.id", "user.user_name"])
                .where("post.id IN(:...post_id)", { post_id: mostLikedPostIds })
                .loadRelationCountAndMap("post.like_count", "post.like", "count")
                .loadRelationCountAndMap("post.comment_count", "post.comment")
                .leftJoin("post.user", "user")
                .getMany();
        });
    }
    create(userInput, user, img) {
        return __awaiter(this, void 0, void 0, function* () {
            let createdPost;
            if (img) {
                const uploadedImage = yield cloudinary_1.default.v2.uploader.upload(img.path);
                createdPost = Post_1.default.create({
                    user,
                    image: {
                        avatar: uploadedImage.secure_url,
                        cloudinary_id: uploadedImage.public_id
                    },
                    text: userInput.text,
                });
                yield createdPost.save();
            }
            else {
                createdPost = Post_1.default.create({
                    user,
                    image: img ? img.path : null,
                    text: userInput.text,
                });
                yield createdPost.save();
            }
            const post = yield Post_1.default.createQueryBuilder("post")
                .select(["post", "post_user.id", "post_user.user_name"])
                .where("post.id = :postId", { postId: createdPost.id })
                .innerJoin("post.user", "post_user")
                .loadRelationCountAndMap("post.like_count", "post.like", "count")
                .loadRelationCountAndMap("post.comment_count", "post.comment")
                .getOne();
            const comments = yield Comment_1.default.createQueryBuilder("comment")
                .select(["comment", "user.id", "user.user_name"])
                .where("comment.post_id = :post_id", { post_id: post.id })
                .innerJoin("comment.user", "user")
                .orderBy("comment.created_at", "ASC")
                .getMany();
            const likedPost = yield Like_1.default.createQueryBuilder("post")
                .where("post.post_id = :post_id", { post_id: post.id })
                .andWhere("post.user_id = :user_id", { user_id: user.id })
                .getOne();
            post.comment = comments;
            post.liked = !!likedPost;
            return post;
        });
    }
    otherPost(currUser, otherUserId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("************ Fetching post, followers/following, name of the other user ************");
            console.log("************ Checking if user and otherUser have a friendShip ************");
            const completedFriendShip = yield FriendShip_1.default.createQueryBuilder("friendship")
                .where(new typeorm_1.Brackets((qb) => {
                qb.where(`friendship.status = :status`, {
                    status: FriendShip_1.FriendShipStatus.COMPLETE,
                })
                    .orWhere(new typeorm_1.Brackets((qb) => {
                    qb.where("friendship.receiver_id = :receiver_id", {
                        receiver_id: otherUserId,
                    }).andWhere("friendship.sender_id = :sender_id", {
                        sender_id: currUser.id,
                    });
                }))
                    .orWhere(new typeorm_1.Brackets((qb) => {
                    qb.where("friendship.receiver_id = :receiver_id", {
                        receiver_id: currUser.id,
                    }).andWhere("friendship.sender_id = :sender_id", {
                        sender_id: otherUserId,
                    });
                }));
            })).getOne();
            const partialFriendship = yield FriendShip_1.default.createQueryBuilder("friendship")
                .where(new typeorm_1.Brackets((qb) => {
                qb.where(`friendship.status = :status`, {
                    status: FriendShip_1.FriendShipStatus.PARTIAL,
                })
                    .orWhere(new typeorm_1.Brackets((qb) => {
                    qb.where("friendship.receiver_id = :receiver_id", {
                        receiver_id: otherUserId,
                    }).andWhere("friendship.sender_id = :sender_id", {
                        sender_id: currUser.id,
                    });
                }))
                    .orWhere(new typeorm_1.Brackets((qb) => {
                    qb.where("friendship.receiver_id = :receiver_id", {
                        receiver_id: currUser.id,
                    }).andWhere("friendship.sender_id = :sender_id", {
                        sender_id: otherUserId,
                    });
                }));
            })).getOne();
            console.log("FRIENDSHIP", completedFriendShip);
            if (completedFriendShip === undefined && partialFriendship === undefined) {
                console.log("************ User and other user friendShip does not exist ************");
                return {
                    friendShip: false,
                    status: "SEND",
                };
            }
            if ((partialFriendship && partialFriendship.status === FriendShip_1.FriendShipStatus.PARTIAL && partialFriendship.sender_id === currUser.id)
                || (completedFriendShip && completedFriendShip.status === FriendShip_1.FriendShipStatus.COMPLETE)) {
                console.log("************ Fetching all the post that other user ************");
                const postsPromise = Post_1.default.createQueryBuilder("post")
                    .select(["post", "post_user.id", "post_user.user_name"])
                    .where("post.user_id = :user_id", { user_id: otherUserId })
                    .innerJoin("post.user", "post_user")
                    .loadRelationCountAndMap("post.like_count", "post.like")
                    .loadRelationCountAndMap("post.comment_count", "post.comment")
                    .orderBy("post.created_at", "DESC")
                    .skip(skip)
                    .take(limit)
                    .getMany();
                const postCountPromise = Post_1.default.createQueryBuilder("post")
                    .where("post.user_id = :user_id", { user_id: otherUserId })
                    .innerJoin("post.user", "post_user")
                    .getCount();
                const [posts, postCount] = yield Promise.all([postsPromise, postCountPromise]);
                const postIds = posts.map((post) => post.id);
                if (postIds.length <= 0) {
                    return [];
                }
                const comments = yield Comment_1.default.createQueryBuilder("comment")
                    .select([
                    "comment",
                    "user.id",
                    "user.user_name",
                ])
                    .where("comment.post_id IN(:...post_id)", { post_id: postIds })
                    .innerJoin("comment.user", "user")
                    .orderBy("comment.created_at", "ASC")
                    .getMany();
                const likedPost = yield Like_1.default.find({
                    where: {
                        user_id: currUser.id,
                    },
                });
                return {
                    friendship: true,
                    status: "VIEW",
                    count: postCount,
                    posts: Post_1.default.mergeCommentLikeAndPost(posts, comments, likedPost),
                };
            }
            return {
                friendship: true,
                status: "ACCEPT"
            };
        });
    }
};
PostService = __decorate([
    (0, typedi_1.Service)()
], PostService);
exports.default = PostService;
