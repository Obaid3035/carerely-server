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
var Post_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("./User"));
const Like_1 = __importDefault(require("./Like"));
const Comment_1 = __importDefault(require("./Comment"));
let Post = Post_1 = class Post extends typeorm_1.BaseEntity {
    static mergeCommentLikeAndPost(posts, comments, likedPost) {
        return posts.map((post) => {
            let i = 0;
            const liked = likedPost.find((like) => {
                return like.post_id === post.id;
            });
            return Object.assign(Object.assign({}, post), { liked: !!liked, comment: comments.filter((comment) => {
                    if (i > 1)
                        return false;
                    if (comment.post_id === post.id) {
                        i++;
                        return true;
                    }
                    return false;
                }) });
        });
    }
};
Post.MODEL_NAME = "post";
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        nullable: false
    })
], Post.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", {
        nullable: true
    })
], Post.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.post, {
        nullable: false,
        eager: true
    }),
    (0, typeorm_1.JoinColumn)({
        name: "user_id"
    })
], Post.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)("int")
], Post.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Like_1.default, (like) => like.post, {
        nullable: true
    })
], Post.prototype, "like", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Comment_1.default, (comment) => comment.post, {
        nullable: true
    })
], Post.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Post.prototype, "created_at", void 0);
Post = Post_1 = __decorate([
    (0, typeorm_1.Entity)(Post_1.MODEL_NAME)
], Post);
exports.default = Post;
