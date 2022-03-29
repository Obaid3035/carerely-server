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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../entities/User"));
const http_status_codes_1 = require("http-status-codes");
const auth = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield User_1.default.findOne(decode.user.id);
            if (!user) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({ error: "Please Authorize Yourself" });
            }
            if (!(user.role === role)) {
                res.status(401).send({
                    error: 'Please Authorize Yourself',
                });
            }
            req.user = user;
            next();
        }
        catch (e) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({ error: "Please Authorize Yourself" });
        }
    });
};
exports.default = auth;
