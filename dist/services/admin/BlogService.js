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
const Blog_1 = __importDefault(require("../../entities/Blog"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const errorCode_1 = require("../../utils/errorCode");
let BlogService = class BlogService {
    index(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogPromise = Blog_1.default.createQueryBuilder("blog")
                .skip(skip)
                .take(limit)
                .getMany();
            const blogCountPromise = Blog_1.default.createQueryBuilder("blog")
                .getCount();
            const [blog, blogCount] = yield Promise.all([blogPromise, blogCountPromise]);
            const formattedBlog = blog.map((blog) => {
                return Object.values(blog);
            });
            return {
                blog: formattedBlog,
                count: blogCount
            };
        });
    }
    show(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield Blog_1.default.findOne(blogId);
            if (!blog) {
                throw new errorCode_1.NotFound("Blog not found");
            }
            return blog;
        });
    }
    create(userInput, user, img) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadedImage = yield cloudinary_1.default.v2.uploader.upload(img.path);
            const createdBlog = Blog_1.default.create({
                user,
                feature_image: {
                    avatar: uploadedImage.secure_url,
                    cloudinary_id: uploadedImage.public_id
                },
                title: userInput.title,
                text: userInput.text,
                is_featured: userInput.is_featured
            });
            yield createdBlog.save();
            return {
                saved: true
            };
        });
    }
    update(userInput, blogId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield Blog_1.default.findOne(blogId);
            if (!blog) {
                throw new errorCode_1.NotFound("Blog not found");
            }
            blog.title = userInput.title;
            blog.text = userInput.text;
            blog.is_featured = userInput.is_featured;
            if (file) {
                const uploadedImage = yield cloudinary_1.default.v2.uploader.upload(file.path);
                blog.feature_image = {
                    avatar: uploadedImage.secure_url,
                    cloudinary_id: uploadedImage.public_id
                };
            }
            yield blog.save();
            return {
                message: "Blog updated successfully!"
            };
        });
    }
};
BlogService = __decorate([
    (0, typedi_1.Service)()
], BlogService);
exports.default = BlogService;
