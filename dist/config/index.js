"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: parseInt(process.env.PORT, 10),
    jwtSecret: process.env.JWT_SECRET,
};
