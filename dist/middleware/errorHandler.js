"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorCode_1 = __importDefault(require("../utils/errorCode"));
const handleError = (err, _req, res, _next) => {
    if (err instanceof errorCode_1.default) {
        return res.status(err.getErrorCode()).json({
            status: 'Error',
            message: err.message,
        });
    }
    return res.status(500).json({
        status: 'Error',
        message: err.message,
    });
};
exports.default = handleError;
