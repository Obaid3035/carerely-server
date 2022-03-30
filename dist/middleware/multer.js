"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storageEngine = multer_1.default.diskStorage({});
const fileFilter = (_req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        return callback(new Error('Please upload a Image'));
    }
    callback(undefined, true);
};
const upload = (0, multer_1.default)({
    storage: storageEngine,
    fileFilter
});
exports.default = upload;
